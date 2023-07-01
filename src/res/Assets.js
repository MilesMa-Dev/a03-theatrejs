import flowmapTexture from '@/assets/textures/common/flowmap.jpg';
import perlinNoiseTexture from '@/assets/textures/common/perlinNoise.png';

// 存放通用资源，只在首次加载，切换场景时不回收
const Common = [
  { name: 'perlinNoiseTexture', source: perlinNoiseTexture, type: 'texture' },
  { name: 'flowmapTexture', source: flowmapTexture, type: 'texture' },
];

const Default = [
 
]

export default {
  Common,
  Default
};
