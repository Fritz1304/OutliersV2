uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;
uniform float uScrollProgress;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    // Displacement (Cursor interaction)
    vec3 newPosition = position;
    float displacementIntensity = texture2D(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.3, displacementIntensity);

    vec3 displacement = vec3(
        cos(aAngle) * 0.2,
        sin(aAngle) * 0.2,
        1.0
    );
    displacement = normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 3.0;
    displacement *= aIntensity;
    
    newPosition += displacement;

    // Scroll Animation (Scatter -> Form Image)
    // When progress = 0: scattered randomly
    // When progress > 0.5: formed
    float scatterAmount = mix(1.0, 0.0, smoothstep(0.0, 0.6, uScrollProgress));
    
    vec3 scatterOffset = vec3(
        cos(aAngle * 5.0) * aIntensity,
        sin(aAngle * 3.0) * aIntensity,
        (aIntensity - 0.5) * 2.0
    ) * scatterAmount * 15.0; // scale scatter

    newPosition += scatterOffset;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Picture color and luminance
    vec3 texColor = texture2D(uPictureTexture, uv).rgb;
    float luminance = dot(texColor, vec3(0.299, 0.587, 0.114));

    // Auto-detect white background by checking the top-left pixel
    vec3 cornerColor = texture2D(uPictureTexture, vec2(0.0, 1.0)).rgb;
    float isWhiteBg = step(0.8, dot(cornerColor, vec3(0.299, 0.587, 0.114)));

    // If white background, the logo is dark. We invert intensity so the dark logo becomes the particles.
    float pictureIntensity = mix(luminance, 1.0 - luminance, isWhiteBg);

    // Filter out very faint noise
    pictureIntensity = smoothstep(0.1, 0.9, pictureIntensity);

    // Point size
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Apply color
    vColor = texColor; 
    
    // If the image had a white background and the logo fragment is black/dark, make it white so it's visible on the dark website background.
    if (isWhiteBg > 0.5 && luminance < 0.2) {
       vColor = vec3(1.0);
    }
