varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

uniform vec3 uLight1Position;
uniform vec3 uLight1Color;
uniform float uLight1Strength;

uniform vec3 uLight2Position;
uniform vec3 uLight2Color;
uniform float uLight2Strength;
uniform float uTime;

float getScatter(vec3 cameraPos, vec3 dir, vec3 lightPos, float d) {
    // light to ray origin
    vec3 q = cameraPos - lightPos;

    // coefficients
    float b = dot(dir, q);
    float c = dot(q, q);

    // evaluate integral
    float t = c - b * b;
    float s = 1.0 / sqrt(max(0.0001, t));
    float l = s * (atan((d + b) * s) - atan(b * s));

    // 150.0 effects radius
    return pow(max(0.0, l / 150.), 0.4);
}

void main() {

    float dash = sin(vUv.x * 5. + uTime * 0.8);

    if (dash < 0.) discard;


    // // normal light
    vec3 lightDir = normalize(uLight1Position - vWorldPosition);
    float diffusion = max(0., dot(vNormal, lightDir));
    // gl_FragColor = vec4(diffusion, 0.0, 0.0, 1.0);

    // light with scatter
    vec3 cameraToWorld = vWorldPosition - cameraPosition;
    vec3 cameraToWorldDir = normalize(cameraToWorld);
    float cameraToWorldDistance = length(cameraToWorld);

    float scatter1 = getScatter(cameraPosition, cameraToWorldDir, uLight1Position, cameraToWorldDistance);
    vec3 color1 = scatter1 * uLight1Color * uLight1Strength;

    float scatter2 = getScatter(cameraPosition, cameraToWorldDir, uLight2Position, cameraToWorldDistance);
    vec3 color2 = scatter2 * uLight2Color * uLight2Strength;

    vec3 final = color1 + color2 ;
    gl_FragColor = vec4(color1 + color2, 1.0);
}