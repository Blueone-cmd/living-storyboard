/*
 * 作品数据入口。首页素材和封面保存在 media/；成片与精彩镜头
 * 首页展示雷神之子与荒岛求生的 TikTok 累计播放数据，由委托人提供。
 */
window.PORTFOLIO_CONTENT = {
  directorName: "钟冲锋",
  statistics: [
    { value: "2000万+", label: "雷神之子 · TikTok累计播放" },
    { value: "4500万+", label: "荒岛求生 · TikTok累计播放" }
  ],
  works: [
    {
      id: "hero-01", type: "shot", title: "首页动态片段 01", subtitle: "用户提供 · 竖屏视频片段", poster: "assets/concept-dragon-city.webp", video: "media/hero-01.mp4", duration: 10, concept: false,
      description: "首页左侧循环播放的原始视频片段。预览封面为概念视觉；片名、剧情资料及对应生成提示词待补充。", chapters: []
    },
    {
      id: "hero-02", type: "shot", title: "首页动态片段 02", subtitle: "用户提供 · 竖屏视频片段", poster: "assets/concept-sky-leviathan.webp", video: "media/hero-02.mp4", duration: 15, concept: false,
      description: "首页中央循环播放的原始视频片段。预览封面为概念视觉；片名、剧情资料及对应生成提示词待补充。", chapters: []
    },
    {
      id: "hero-03", type: "shot", title: "首页动态片段 03", subtitle: "用户提供 · 竖屏视频片段", poster: "assets/concept-island-survivors.webp", video: "media/hero-03.mp4", duration: 14, concept: false,
      description: "首页右侧循环播放的原始视频片段。预览封面为概念视觉；片名、剧情资料及对应生成提示词待补充。", chapters: []
    },
    {
      id: "film-01", type: "film", title: "单集成片 01", subtitle: "完整作品位置 · 待导入", poster: "assets/concept-dragon-city.webp", reelPoster: "assets/reel-frame-01.webp", video: "", duration: 0, concept: true,
      description: "此处将接入第一部真实单集成片。当前画面为根据概念图创作的演示素材。",
      chapters: []
    },
    {
      id: "film-02", type: "film", title: "单集成片 02", subtitle: "完整作品位置 · 待导入", poster: "assets/concept-sky-leviathan.webp", reelPoster: "assets/reel-frame-02.webp", video: "", duration: 0, concept: true,
      description: "此处将接入第二部真实单集成片。播放数据可与对应作品关联。",
      chapters: []
    },
    {
      id: "film-03", type: "film", title: "单集成片 03", subtitle: "完整作品位置 · 待导入", poster: "assets/concept-island-survivors.webp", reelPoster: "assets/reel-frame-03.webp", video: "", duration: 0, concept: true,
      description: "此处将接入第三部真实单集成片，及其关键镜头的提示词时间轴。",
      chapters: []
    },
    { id: "film-04", type: "film", title: "单集成片 04", subtitle: "完整作品位置 · 待导入", poster: "", reelPoster: "assets/reel-frame-04.webp", video: "", duration: 0, concept: true, description: "等待导入真实成片。", chapters: [] },
    { id: "film-05", type: "film", title: "单集成片 05", subtitle: "完整作品位置 · 待导入", poster: "", reelPoster: "assets/reel-frame-05.webp", video: "", duration: 0, concept: true, description: "等待导入真实成片。", chapters: [] },
    { id: "film-06", type: "film", title: "单集成片 06", subtitle: "完整作品位置 · 待导入", poster: "", reelPoster: "assets/reel-frame-06.webp", video: "", duration: 0, concept: true, description: "等待导入真实成片。", chapters: [] },
    { id: "film-07", type: "film", title: "单集成片 07", subtitle: "完整作品位置 · 待导入", poster: "", reelPoster: "assets/reel-frame-07.webp", video: "", duration: 0, concept: true, description: "等待导入真实成片。", chapters: [] },
    { id: "film-08", type: "film", title: "单集成片 08", subtitle: "完整作品位置 · 待导入", poster: "", reelPoster: "assets/reel-frame-08.webp", video: "", duration: 0, concept: true, description: "等待导入真实成片。", chapters: [] },
    { id: "film-09", type: "film", title: "单集成片 09", subtitle: "完整作品位置 · 待导入", poster: "", reelPoster: "assets/reel-frame-09.webp", video: "", duration: 0, concept: true, description: "等待导入真实成片。", chapters: [] },
    { id: "film-10", type: "film", title: "单集成片 10", subtitle: "完整作品位置 · 待导入", poster: "", reelPoster: "assets/reel-frame-10.webp", video: "", duration: 0, concept: true, description: "等待导入真实成片。", chapters: [] },
    {
      id: "shot-demo-01", type: "shot", title: "压迫感 / 空间反转", subtitle: "镜头片段 · 概念演示", poster: "assets/concept-dragon-city.webp", video: "", duration: 24, concept: true,
      description: "演示：以纵向构图保留巨物和地面人物的尺度差，通过三次高度变化制造压迫感。",
      chapters: [
        { at: 0, title: "建立空间", prompt: "9:16 竖屏，低机位贴近翻涌海面向城堡缓慢推进，前景浪峰遮挡，远景保持城堡轮廓清晰；冷蓝色暴风光，真实水体物理反馈。", rationale: "先用海面给观众一个可感知的空间尺度，再让城堡进入视线。" },
        { at: 8, title: "巨物显影", prompt: "镜头沿城墙快速抬升，乌云后方的巨龙先露出翼尖再露出头部；城堡与龙始终处于同一纵轴，避免比例漂移；雷光只在关键动作瞬间闪现。", rationale: "巨物分段出现，比一次性全景更能积累威胁。" },
        { at: 17, title: "情绪爆点", prompt: "镜头短暂后撤并稳定，巨龙在画面上三分之一处张口，能量沿前景碎石和水面传导；保留地面人物的微小剪影，持续强调尺度。", rationale: "爆发时需要稳定空间关系，观众才看得懂冲击从哪里来。" }
      ]
    },
    {
      id: "shot-demo-02", type: "shot", title: "云海 / 追逐揭示", subtitle: "镜头片段 · 概念演示", poster: "assets/concept-sky-leviathan.webp", video: "", duration: 20, concept: true,
      description: "演示：用运动方向与遮挡关系在竖屏中展示空中追逐。",
      chapters: [
        { at: 0, title: "跟住目标", prompt: "9:16 竖屏，摄影机与直升机平行跟拍，云层作为前景快速掠过；暖色日光从云背透出，维持飞行器真实尺寸。", rationale: "用可辨认的小主体建立速度基准。" },
        { at: 7, title: "揭开威胁", prompt: "镜头横移后突然减速，巨兽轮廓在直升机前方云墙中显影；先看到牙齿与阴影，再显示完整头部，保持视线方向一致。", rationale: "先给线索再给全貌，让尺度揭示成为戏剧动作。" },
        { at: 14, title: "拉开距离", prompt: "镜头抬升到远景，日落海面与巨兽同框，直升机向画面右上逃离；云的运动方向反衬主体速度。", rationale: "远景收束局部惊险，交代下一场的空间方向。" }
      ]
    },
    {
      id: "frame-demo-01", type: "frame", title: "雷暴之城", subtitle: "画面帧 · 概念演示", poster: "assets/concept-dragon-city.webp", video: "", duration: 0, concept: true,
      description: "演示静帧。这里可以展示原帧、关键构图线与对应镜头意图。", chapters: []
    },
    {
      id: "frame-demo-02", type: "frame", title: "云上巨影", subtitle: "画面帧 · 概念演示", poster: "assets/concept-sky-leviathan.webp", video: "", duration: 0, concept: true,
      description: "演示静帧。竖屏构图保留空中巨物与飞行器的尺度关系。", chapters: []
    },
    {
      id: "frame-demo-03", type: "frame", title: "海岛群像", subtitle: "画面帧 · 概念演示", poster: "assets/concept-island-survivors.webp", video: "", duration: 0, concept: true,
      description: "演示静帧。多角色站位引导观众沿画面纵深阅读空间。", chapters: []
    },
    {
      id: "prompt-demo-01", type: "prompt", title: "群像 / 目标揭示", subtitle: "提示词片段拆分 · 概念演示", poster: "assets/concept-island-survivors.webp", video: "", duration: 18, concept: true,
      description: "演示：从背影群像到远处目标，用可被读懂的运动线完成镜头转场。",
      chapters: [
        { at: 0, title: "人物先于景观", prompt: "9:16 竖屏，五名角色背对镜头站在湿润礁石上，视线朝向海湾深处；低位逆光，人物轮廓彼此分开，保留清晰剪影。", rationale: "先让观众知道是谁在看，景观才有叙事归属。" },
        { at: 6, title: "顺视线推进", prompt: "摄影机从角色肩后缓慢前推，沿五人共同的视线方向穿过前景枝叶，露出远方废弃巨轮；不改变角色相对站位。", rationale: "人物视线充当镜头运动的因果。" },
        { at: 12, title: "画面停留", prompt: "镜头停在可同时看见小比例人物与巨大沉船的中远景，阳光从船体后缘照出；海浪、枝叶和衣物保持持续微运动。", rationale: "给观众足够时间辨认目标与人物的尺度关系。" }
      ]
    }
  ],
  // 01–07 与委托人提供的角色卡文件顺序一致。castImage 是动作造型，views 是原设定参考。
  // 所有原设定参考图均使用透明 PNG。拼图仅在 viewCrop 指定的范围内裁切显示。
  characters: [
    {
      id: "character-01", name: "塞拉", action: "横剑前突", description: "红发、黑红护甲与长剑延续原设定。动作造型将剑锋横贯前景，重心前压，形成近身反击的瞬间。",
      castImage: "assets/cast/01-sera.webp", views: { front: "assets/character-reference/01-sheet-alpha.webp", side: "assets/character-reference/01-sheet-alpha.webp", back: "assets/character-reference/01-sheet-alpha.webp" },
      viewCrop: { front: [0, 0, .242, .924], side: [.244, 0, .15, .924], back: [.397, 0, .19, .924] }
    },
    {
      id: "character-02", name: "虚空之王", action: "抬手控场", description: "银灰裂面具、环形头饰与层叠长袍来自原设定。动作造型向镜头探手，让袍摆在身后展开，强化压迫感。",
      castImage: "assets/cast/02-void-king.webp", views: { front: "assets/character-reference/02-front-alpha.webp", side: "assets/character-reference/02-side-alpha.webp", back: "assets/character-reference/02-back-alpha.webp" }
    },
    {
      id: "character-03", name: "角色 03", action: "雷霆之茅迎敌", description: "原图未标注姓名：白金长发、银甲与雷霆之茅。动作造型斜向架枪，蓝晶枪尖从高处切入前景，雷纹枪杆贯穿双手握持。",
      castImage: "assets/cast/03-spearwoman.webp", views: { front: "assets/character-reference/03-front-transparent.webp", side: "assets/character-reference/03-side-alpha.webp", back: "assets/character-reference/03-back-alpha.webp" },
      referenceFrame: { visibleHeight: .96, centerY: .5 }
    },
    {
      id: "character-04", name: "凯尔", action: "单手扛雷神之斧", description: "金发与深靛色层叠长外套来自新版设定。单手将长柄雷神之斧扛在肩后，斧刃朝上，另一手自然垂落；斧刃蓝白电光轻照肩颈。",
      castImage: "assets/cast/04-kyle.webp", views: { front: "assets/character-reference/04-front-alpha.webp", side: "assets/character-reference/04-side-alpha.webp", back: "assets/character-reference/04-back-alpha.webp" },
      weaponReference: "assets/character-reference/04-axe.webp"
    },
    {
      id: "character-05", name: "莉迪亚", action: "手持卷宗 · 从容转身", description: "金发与酒红长裙沿用原设定。莉迪亚是文职人物，手持卷宗与图纸从容转身，以衣裙摆动呈现身份气质，不使用武器或法术。",
      castImage: "assets/cast/05-lydia.webp", views: { front: "assets/character-reference/05-front-alpha.webp", side: "assets/character-reference/05-side-alpha.webp", back: "assets/character-reference/05-back-alpha.webp" }
    },
    {
      id: "character-06", name: "罗恩", action: "熔刃蓄势", description: "黑发、暗红披风与熔纹铠甲延续原三视图。动作造型双手压低熔光巨剑，剑势朝画面外延伸。",
      castImage: "assets/cast/06-ron.webp", views: { front: "assets/character-reference/06-sheet-alpha.webp", side: "assets/character-reference/06-sheet-alpha.webp", back: "assets/character-reference/06-sheet-alpha.webp" },
      viewCrop: { front: [0, 0, .225, 1], side: [.25, 0, .19, 1], back: [.444, 0, .226, 1] }
    },
    {
      id: "character-07", name: "罗德里克", action: "长剑镇守", description: "保留深蓝金纹铠甲、披风与长剑。动作造型将剑立于身侧，转身注视远处战场，建立沉稳的守护者姿态。",
      castImage: "assets/cast/07-roderick.webp", views: { front: "assets/character-reference/07-sheet-alpha.webp", side: "assets/character-reference/07-sheet-alpha.webp", back: "assets/character-reference/07-sheet-alpha.webp" },
      viewCrop: { front: [0, 0, .252, .96], side: [.255, 0, .183, .96], back: [.44, 0, .25, .96] }
    }
  ]
};

// The archive uses the user's real, local videos. The video URLs point to the
// Poster frames are cached locally for fast browsing; titles remain faithful
// to the source files (each finished file is an episode or individual work).
(() => {
  const data = window.PORTFOLIO_CONTENT;
  const localFile = (...parts) => `media/source/${parts.map(encodeURIComponent).join('/')}`;
  const shotNames = [
    '10月26日.mp4', '10月26日(1).mp4', '10月26日(2).mp4', '10月26日(3).mp4',
    '10月26日(4).mp4', '10月26日(5).mp4', '10月26日(6).mp4', '10月26日(7).mp4',
    '雷神之子片段-03.mp4', '雷神之子片段-05.mp4', '荒岛求生片段 01.mp4',
    '雷神之子片段-06.mp4', '片段11-历史版本2.mp4'
  ];
  const filmFiles = [
    ['thor', '雷神系列', '雷神之子第一季 01.mp4'],
    ['thor', '雷神系列', '雷神之子第二季 18.mp4'],
    ['thor', '雷神系列', '雷神之子第二季 19.mp4'],
    ['thor', '雷神系列', '雷神之子第二季 35.mp4'],
    ['thor', '雷神系列', '雷神之子第二季 36.mp4'],
    ['thor', '雷神系列', '雷神之子第二季 48.mp4'],
    ['island', '荒岛系列', '荒岛求生 02.mp4'],
    ['island', '荒岛系列', '荒岛求生 04.mp4'],
    ['island', '荒岛系列', '荒岛求生 30.mp4'],
    // Only the supplied watermarked versions are shown in 其他类型.
    ['other', '其他类型/有水印', '08 被囚禁的影后.mp4'],
    ['other', '其他类型/有水印', '04 任志达 抖音《理想与现实》.mp4'],
    ['other', '其他类型/有水印', '05 我成了前任的继母 01.mp4'],
    ['other', '其他类型/有水印', '06 我成了前任的继母 02.mp4'],
    ['other', '其他类型/有水印', '03 我的孩子要叫妹妹妈妈.mp4'],
    ['other', '其他类型/有水印', '02 我的命定伴侣是狼王.mp4'],
    ['other', '其他类型/有水印', '07 乡村妻子.mp4'],
    ['other', '其他类型/有水印', '01 最后一通电话.mp4']
  ];
  const filmWorks = filmFiles.map(([category, folder, filename], index) => {
    const number = String(index + 1).padStart(2, '0');
    const parts = folder.split('/');
    return {
      id: `film-${number}`, type: 'film', category, title: filename.replace(/^\d{2}\s+/, '').replace(/\.mp4$/i, ''),
      sourceOrder: category === 'other' ? Number(filename.match(/^(\d{2})\s/)?.[1]) : null,
      subtitle: parts[0] + (category === 'other' ? ' · 有水印' : ' · 成片'),
      poster: `media/films/film-${number}${category === 'other' ? '-watermarked' : ''}.webp`,
      video: localFile('04 成片视频', ...parts, filename),
      duration: 0, concept: false, chapters: []
    };
  });
  // Source filenames define the 01–08 sequence; stable ids keep each video paired with its existing poster.
  const otherStart = filmWorks.findIndex(work => work.category === 'other');
  if (otherStart >= 0) {
    filmWorks.splice(otherStart, filmWorks.length - otherStart,
      ...filmWorks.slice(otherStart).sort((a, b) => a.sourceOrder - b.sourceOrder));
  }
  const shotWorks = shotNames.map((filename, index) => {
    const number = String(index + 1).padStart(2, '0');
    return {
      id: `shot-${number}`, type: 'shot', title: filename.replace(/\.mp4$/i, ''),
      subtitle: '用户提供 · 精彩镜头', poster: `media/reel/clip-${number}.webp`,
      video: localFile('02 胶片放映带片段视频', filename),
      reelPreview: `media/reel/clip-${number}.mp4`, duration: 0, concept: false, chapters: []
    };
  });
  data.works = [
    ...filmWorks, ...shotWorks,
    ...data.works.filter(work => work.type === 'prompt')
  ];
})();
