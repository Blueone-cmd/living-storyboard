/* Generated from the three local character-category manifests. */
(() => {
  const content = window.PORTFOLIO_CONTENT;
  if (!content?.characters) return;
  const originalGender = ["female", "male", "female", "male", "female", "male", "male"];
  content.characters.forEach((character, index) => {
    if (index < 7) {
      character.category ||= "fantasy";
      character.gender ||= originalGender[index];
    }
  });
  content.characters.push(...[
  {
    "id": "fantasy-08",
    "name": "伊斯雷尔",
    "category": "fantasy",
    "gender": "male",
    "action": "持星盘杖迎风迈步，紫袍随步伐展开",
    "castImage": "assets/new-characters/fantasy/action-08.webp",
    "views": {
      "front": "assets/new-characters/fantasy/view-08-front.webp",
      "side": "assets/new-characters/fantasy/view-08-side.webp",
      "back": "assets/new-characters/fantasy/view-08-back.webp"
    },
    "subjectAnchor": {
      "front": 0.65,
      "side": 0.38,
      "back": 0.48
    }
  },
  {
    "id": "fantasy-09",
    "name": "达里安",
    "category": "fantasy",
    "gender": "male",
    "action": "优雅前探出剑，蓝色礼服外套随动作扬起",
    "castImage": "assets/new-characters/fantasy/action-09.webp",
    "views": {
      "front": "assets/new-characters/fantasy/view-09-front.webp",
      "side": "assets/new-characters/fantasy/view-09-side.webp",
      "back": "assets/new-characters/fantasy/view-09-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.49,
      "back": 0.5
    }
  },
  {
    "id": "fantasy-10",
    "name": "老船长",
    "category": "fantasy",
    "gender": "male",
    "action": "迎风稳立，举起黄铜望远镜望向远方",
    "castImage": "assets/new-characters/fantasy/action-10.webp",
    "views": {
      "front": "assets/new-characters/fantasy/view-10-front.webp",
      "side": "assets/new-characters/fantasy/view-10-side.webp",
      "back": "assets/new-characters/fantasy/view-10-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.47,
      "back": 0.5
    }
  },
  {
    "id": "fantasy-11",
    "name": "瓦伦",
    "category": "fantasy",
    "gender": "male",
    "action": "转身整理黑手套，黑金礼袍翻起",
    "castImage": "assets/new-characters/fantasy/action-11.webp",
    "views": {
      "front": "assets/new-characters/fantasy/view-11-front.webp",
      "side": "assets/new-characters/fantasy/view-11-side.webp",
      "back": "assets/new-characters/fantasy/view-11-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "old-01",
    "name": "克拉丽萨",
    "category": "old-money",
    "gender": "female",
    "action": "提裙回身，抬手致意",
    "castImage": "assets/new-characters/old-money/action-01.webp",
    "views": {
      "front": "assets/new-characters/old-money/view-01-front.webp",
      "side": "assets/new-characters/old-money/view-01-side.webp",
      "back": "assets/new-characters/old-money/view-01-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "old-02",
    "name": "朱利安",
    "category": "old-money",
    "gender": "male",
    "action": "迈步整理袖口",
    "castImage": "assets/new-characters/old-money/action-02.webp",
    "views": {
      "front": "assets/new-characters/old-money/view-02-front.webp",
      "side": "assets/new-characters/old-money/view-02-side.webp",
      "back": "assets/new-characters/old-money/view-02-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "old-03",
    "name": "奥古斯都",
    "category": "old-money",
    "gender": "male",
    "action": "阔步压襟，目光沉稳",
    "castImage": "assets/new-characters/old-money/action-03.webp",
    "views": {
      "front": "assets/new-characters/old-money/view-03-front.webp",
      "side": "assets/new-characters/old-money/view-03-side.webp",
      "back": "assets/new-characters/old-money/view-03-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "old-04",
    "name": "瓦莱丽娅",
    "category": "old-money",
    "gender": "female",
    "action": "转身扬起婚纱裙摆",
    "castImage": "assets/new-characters/old-money/action-04.webp",
    "views": {
      "front": "assets/new-characters/old-money/view-04-front.webp",
      "side": "assets/new-characters/old-money/view-04-side.webp",
      "back": "assets/new-characters/old-money/view-04-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "old-05",
    "name": "蒙哥马利",
    "category": "old-money",
    "gender": "male",
    "action": "持杖向前，气度从容",
    "castImage": "assets/new-characters/old-money/action-05.webp",
    "views": {
      "front": "assets/new-characters/old-money/view-05-front.webp",
      "side": "assets/new-characters/old-money/view-05-side.webp",
      "back": "assets/new-characters/old-money/view-05-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "old-06",
    "name": "埃莉诺",
    "category": "old-money",
    "gender": "female",
    "action": "提起礼服裙摆，回眸",
    "castImage": "assets/new-characters/old-money/action-06.webp",
    "views": {
      "front": "assets/new-characters/old-money/view-06-front.webp",
      "side": "assets/new-characters/old-money/view-06-side.webp",
      "back": "assets/new-characters/old-money/view-06-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "old-08",
    "name": "比阿特丽斯",
    "category": "old-money",
    "gender": "female",
    "action": "轻步抚发，神情克制",
    "castImage": "assets/new-characters/old-money/action-08.webp",
    "views": {
      "front": "assets/new-characters/old-money/view-08-front.webp",
      "side": "assets/new-characters/old-money/view-08-side.webp",
      "back": "assets/new-characters/old-money/view-08-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "old-09",
    "name": "瓦莱丽娅",
    "category": "old-money",
    "gender": "female",
    "action": "轻抬礼帽，手提珠宝包",
    "castImage": "assets/new-characters/old-money/action-09.webp",
    "views": {
      "front": "assets/new-characters/old-money/view-09-front.webp",
      "side": "assets/new-characters/old-money/view-09-side.webp",
      "back": "assets/new-characters/old-money/view-09-back.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-01",
    "name": "Astrid",
    "category": "modern",
    "gender": "female",
    "action": "转身回眸",
    "castImage": "assets/new-characters/modern/pose-v2-01.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-01.webp",
      "side": "assets/new-characters/modern/view-v2-side-01.webp",
      "back": "assets/new-characters/modern/view-v2-back-01.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-02",
    "name": "Della May",
    "category": "modern",
    "gender": "female",
    "action": "迎风迈步",
    "castImage": "assets/new-characters/modern/pose-v2-02.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-02.webp",
      "side": "assets/new-characters/modern/view-v2-side-02.webp",
      "back": "assets/new-characters/modern/view-v2-back-02.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-03",
    "name": "Sola",
    "category": "modern",
    "gender": "female",
    "action": "警觉侧转",
    "castImage": "assets/new-characters/modern/pose-v2-03.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-03.webp",
      "side": "assets/new-characters/modern/view-v2-side-03.webp",
      "back": "assets/new-characters/modern/view-v2-back-03.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-06",
    "name": "艾玛·贝内特",
    "category": "modern",
    "gender": "female",
    "action": "从容疾行",
    "castImage": "assets/new-characters/modern/pose-v2-06.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-06.webp",
      "side": "assets/new-characters/modern/view-v2-side-06.webp",
      "back": "assets/new-characters/modern/view-v2-back-06.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-07",
    "name": "罗曼·斯特林",
    "category": "modern",
    "gender": "male",
    "action": "低身变向",
    "castImage": "assets/new-characters/modern/pose-v2-07.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-07.webp",
      "side": "assets/new-characters/modern/view-v2-side-07.webp",
      "back": "assets/new-characters/modern/view-v2-back-07.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-08",
    "name": "龙纹男",
    "category": "modern",
    "gender": "male",
    "action": "战术戒备",
    "castImage": "assets/new-characters/modern/pose-v2-08.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-08.webp",
      "side": "assets/new-characters/modern/view-v2-side-08.webp",
      "back": "assets/new-characters/modern/view-v2-back-08.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-09",
    "name": "艾玛·贝内特",
    "category": "modern",
    "gender": "female",
    "action": "礼服旋身",
    "castImage": "assets/new-characters/modern/pose-v2-09.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-09.webp",
      "side": "assets/new-characters/modern/view-v2-side-09.webp",
      "back": "assets/new-characters/modern/view-v2-back-09.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-10",
    "name": "丹尼尔·斯特林",
    "category": "modern",
    "gender": "male",
    "action": "从容整袖",
    "castImage": "assets/new-characters/modern/pose-v2-10.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-10.webp",
      "side": "assets/new-characters/modern/view-v2-side-10.webp",
      "back": "assets/new-characters/modern/view-v2-back-10.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-11",
    "name": "罗曼·斯特林",
    "category": "modern",
    "gender": "male",
    "action": "起跑蓄势",
    "castImage": "assets/new-characters/modern/pose-v2-11.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-11.webp",
      "side": "assets/new-characters/modern/view-v2-side-11.webp",
      "back": "assets/new-characters/modern/view-v2-back-11.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-12",
    "name": "伊森·布鲁克斯",
    "category": "modern",
    "gender": "male",
    "action": "自信迈步",
    "castImage": "assets/new-characters/modern/pose-v2-12.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-12.webp",
      "side": "assets/new-characters/modern/view-v2-side-12.webp",
      "back": "assets/new-characters/modern/view-v2-back-12.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-13",
    "name": "克洛伊·贝内特",
    "category": "modern",
    "gender": "female",
    "action": "俏皮转身",
    "castImage": "assets/new-characters/modern/pose-v2-13.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-13.webp",
      "side": "assets/new-characters/modern/view-v2-side-13.webp",
      "back": "assets/new-characters/modern/view-v2-back-13.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-14",
    "name": "索菲·莱恩",
    "category": "modern",
    "gender": "female",
    "action": "轻扶领结",
    "castImage": "assets/new-characters/modern/pose-v2-14.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-14.webp",
      "side": "assets/new-characters/modern/view-v2-side-14.webp",
      "back": "assets/new-characters/modern/view-v2-back-14.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-15",
    "name": "索菲·莱恩",
    "category": "modern",
    "gender": "female",
    "action": "干练前行",
    "castImage": "assets/new-characters/modern/pose-v2-15.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-15.webp",
      "side": "assets/new-characters/modern/view-v2-side-15.webp",
      "back": "assets/new-characters/modern/view-v2-back-15.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-17",
    "name": "罗根",
    "category": "modern",
    "gender": "male",
    "action": "坚毅站姿",
    "castImage": "assets/new-characters/modern/pose-v2-17.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-17.webp",
      "side": "assets/new-characters/modern/view-v2-side-17.webp",
      "back": "assets/new-characters/modern/view-v2-back-17.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-19",
    "name": "艾玛·海斯",
    "category": "modern",
    "gender": "female",
    "action": "轻盈转身",
    "castImage": "assets/new-characters/modern/pose-v2-19.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-19.webp",
      "side": "assets/new-characters/modern/view-v2-side-19.webp",
      "back": "assets/new-characters/modern/view-v2-back-19.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-20",
    "name": "艾琳娜",
    "category": "modern",
    "gender": "female",
    "action": "攀途回望",
    "castImage": "assets/new-characters/modern/pose-v2-20.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-20.webp",
      "side": "assets/new-characters/modern/view-v2-side-20.webp",
      "back": "assets/new-characters/modern/view-v2-back-20.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  },
  {
    "id": "modern-21",
    "name": "莉莉",
    "category": "modern",
    "gender": "female",
    "action": "冷静戒备",
    "castImage": "assets/new-characters/modern/pose-v2-21.webp",
    "views": {
      "front": "assets/new-characters/modern/view-v2-front-21.webp",
      "side": "assets/new-characters/modern/view-v2-side-21.webp",
      "back": "assets/new-characters/modern/view-v2-back-21.webp"
    },
    "subjectAnchor": {
      "front": 0.5,
      "side": 0.5,
      "back": 0.5
    }
  }
]);
})();
