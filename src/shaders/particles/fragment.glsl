varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = length(uv - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.28, 0.5, distanceToCenter);

    if(distanceToCenter > 0.5)
        discard;

    gl_FragColor = vec4(vColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
