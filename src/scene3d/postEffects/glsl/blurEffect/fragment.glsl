#define M_PI 3.1415926535897932384626433832795

uniform vec2 uStrength;

vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // vec4 diffuseColor = texture2D(inputBuffer, uv);
  vec4 blurColor = blur9(inputBuffer, uv, resolution, uStrength);
  float blurStrength = 1.0 - sin(uv.y * M_PI);
  outputColor = mix(inputColor, blurColor, blurStrength);

	// outputColor = vec4(inputColor.rgb * weights, inputColor.a);

}