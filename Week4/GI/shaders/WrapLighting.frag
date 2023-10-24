
#version 410

uniform sampler2D albedoTexture;

layout(std140) uniform cameraBlock
{
	mat4 worldToClip;
	vec4 cameraPos;
	vec4 cameraDir;
};
in vec3 worldNorm;
in vec3 worldPos;

uniform vec3 lightPos;
vec3 lightDir;
float lightDist;

in vec2 texCoord;

uniform float wrapAmount;

out vec4 colorOut;
uniform vec4 color;

void main()
{
	vec3 albedo = texture(albedoTexture, texCoord).xyz;

	// Add your illumination code here!
	lightDir = normalize(lightPos - worldPos);
	lightDist = length(worldPos - lightPos);

	float wrapFactor = clamp((dot(lightDir, normalize(worldNorm) + wrapAmount)) / (1 + wrapAmount), 0, 1);

	colorOut.xyz = albedo;

	// Lighting Pass
	colorOut *= 60;
	colorOut *= wrapFactor;

	colorOut /= (lightDist) * (lightDist);

	colorOut.a = 1.0;
}

