varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - vec2(0.5));

    // Soft circular edge instead of hard discard
    float alpha = 1.0 - smoothstep(0.4, 0.5, distanceToCenter);

    if(alpha < 0.01)
        discard;

    gl_FragColor = vec4(vColor, alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
