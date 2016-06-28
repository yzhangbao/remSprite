背景：移动开发使用rem单位时，由于各种原因，导致雪碧图background-position定位不精准（为什么要使用Sprite技术地球人都知道了）
解决办法：使用百分比（%）属性，公式：background-position: 0 iconOffsetY/(iconHeight-iconTotalHeight)*100%;