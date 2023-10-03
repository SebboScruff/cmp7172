
#version 410

uniform sampler2D albedoTexture;
uniform sampler1D lightingTexture;

layout(std140) uniform cameraBlock
{
	mat4 worldToClip;
	vec4 cameraPos;
	vec4 cameraDir;
};
in vec3 worldNorm;
in vec3 fragPosWorld;
in vec2 texCoord;

out vec4 colorOut;
uniform vec4 color;
uniform vec3 lightPosWorld;
	
void main()
{
	vec3 albedo = texture(albedoTexture, texCoord).xyz;

	// -- Your code here ---
	// Modulate the lighting using the 1D texture you loaded.
	vec3 lightDir = normalize(lightPosWorld - fragPosWorld);
	float lightingFactor = clamp(dot(lightDir, normalize(worldNorm)), 0, 1);
	float lighting = texture(lightingTexture, lightingFactor).r;

	colorOut.xyz = albedo;
	colorOut *= lighting;
	colorOut.a = 1.0;
}

