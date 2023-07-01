uniform vec3 uColor;
uniform float uStrength;

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {

	vec3 finalColor = inputColor.rgb + uColor * pow(depth, uStrength);
	// vec3 finalColor = inputColor.rgb * uColor * pow(depth, uStrength);
	outputColor = vec4( finalColor , inputColor.a);
	// outputColor = vec4(vec3(pow(depth, uStrength)), inputColor.a);

}