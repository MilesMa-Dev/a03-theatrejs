varying vec2 vUv;
varying vec4 vUvRefraction;
varying vec4 worldPosition;

uniform vec3 color;
uniform vec3 uGroundColor;
uniform sampler2D tDiffuse;
uniform sampler2D tDudv;
uniform vec2 resolution;
uniform vec2 uDirection;
uniform vec2 uvOffset;
uniform float uBluriness;
uniform float uDistortionStrength;
uniform float uReflectMix;

#pragma glslify: blend = require(glsl-blend/average)
#pragma glslify: blend2 = require(glsl-blend/add)
#pragma glslify: blur13 = require('../modules/blur13')

float blendOverlay(float base, float blend) {
    return (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
    return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
}

float smootherstep(float edge0, float edge1, float x) {
    x = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
    return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

void main() {


    #ifndef IS_SUPPORT_REFLECT

        vec3 light_color = uGroundColor;
        gl_FragColor = vec4(light_color, 1.0);

    #else
        
        vec2 distortedUv = texture2D(tDudv, vec2(vUv.x, vUv.y)).rg * uDistortionStrength;
        distortedUv = vUv.xy + vec2(distortedUv.x, distortedUv.y);
        vec2 distortion = (texture2D(tDudv, distortedUv).rg * 2.0 - 1.0) * uDistortionStrength;

        vec4 uv = vec4(vUvRefraction);
        uv.xy += distortion + uvOffset;

        #ifdef USE_BLUR
            vec2 uvProj = vec2(uv.x / uv.w, uv.y / uv.w);
            vec4 base = blur13(tDiffuse, uvProj, resolution, smootherstep(uBluriness, 0.0, vUv.y) * (uDirection));
        #else
            vec4 base = texture2DProj(tDiffuse, uv);
        #endif

        vec3 reflect_color = blendOverlay(base.rgb, color);

        vec3 mixColor = blend2(uGroundColor, reflect_color, uReflectMix);

        gl_FragColor = vec4(mixColor, 1.0);

    #endif
}