uniform mat4 textureMatrix;

varying vec2 vUv;
varying vec4 vUvRefraction;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 worldPosition;

void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    vUvRefraction = textureMatrix * vec4(position, 1.0);
    worldPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}