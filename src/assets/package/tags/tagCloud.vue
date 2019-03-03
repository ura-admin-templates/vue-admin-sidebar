<template>
    <div class="tag-cloud-container">
        <svg :width='width'
             :height='height'
             @click='listener($event)'>
            <text v-if="tags.length === 0" class="no-tags" x='50%' y='50%' transform="translate(-50, 0)">暂时没有数据</text>
            <a href="javascript:;"
               v-for='tag in tags'
               :key="'tag' + tag.text"
               @click="handleTagClick(tag)">
                <text :x='tag.x'
                      :y='tag.y'
                      transform="translate(-50, 0)"
                      :font-size='15 * (600/(300-tag.z))'
                      :fill-opacity='((400+tag.z)/600)'>{{tag.text}}</text>
            </a>
        </svg>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'tagCloud',
  data () {
    return {
      loading: true,
      timer: null,
      speedX: 1 / 180,
      speedY: 1 / 180,
      tags: []
    }
  },
  props: {
    width: {
      type: Number,
      default: 420
    },
    height: {
      type: Number,
      default: 420
    },
    radius: {
      type: Number,
      default: 150
    },
    tagsData: {
      type: Array,
      default: () => []
    }
    // speedX: {
    //     type: Number,
    //     default: 1 / 180
    // },
    // speedY: {
    //     type: Number,
    //     default: 1 / 180
    // }
  },
  watch: {
    tagsData (value) {
      this.initTags()
    }
  },
  computed: {
    CX () {
      // 球心x坐标
      return this.width / 2
    },
    CY () {
      // 球心y坐标
      return this.height / 2
    }
  },
  created () {
    this.initTags()
  },
  methods: {
    initTags () {
      const len = this.tagsData.length
      const tags = _.cloneDeep(this.tagsData)
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i]
        const k = -1 + (2 * (i + 1) - 1) / len
        const a = Math.acos(k)
        const b = a * Math.sqrt(len * Math.PI) // 计算标签相对于球心的角度
        tag.text = tag.name || tag.text || tag.tagName
        tag.x = this.CX + this.radius * Math.sin(a) * Math.cos(b) // 根据标签角度求出标签的x,y,z坐标
        tag.y = this.CY + this.radius * Math.sin(a) * Math.sin(b)
        tag.z = this.radius * Math.cos(a)
      }
      this.tags = tags
      console.log(this.tags)
    },
    handleTagClick (tag) {
      // code 处理标签点击事件
    },
    rotateX (angleX) {
      const cos = Math.cos(angleX)
      const sin = Math.sin(angleX)
      for (const tag of this.tags) {
        const y1 = (tag.y - this.CY) * cos - tag.z * sin + this.CY
        const z1 = tag.z * cos + (tag.y - this.CY) * sin
        tag.y = y1
        tag.z = z1
      }
    },
    rotateY (angleY) {
      const cos = Math.cos(angleY)
      const sin = Math.sin(angleY)
      for (const tag of this.tags) {
        const x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX
        const z1 = tag.z * cos + (tag.x - this.CX) * sin
        tag.x = x1
        tag.z = z1
      }
    },
    listener (event) {
      // 响应鼠标移动
      const x = event.offsetY - this.CX
      const y = event.offsetX - this.CY
      this.speedX = x > 0 ? -1 / 180 : 1 / 180
      this.speedY = y > 0 ? -1 / 180 : 1 / 180
    }
  },
  mounted () {
    // 使球开始旋转
    this.timer = setInterval(() => {
      this.rotateX(this.speedX)
      this.rotateY(this.speedY)
    }, 50)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="scss" scoped>
.tag-cloud-container {
    width: auto;
    height: auto;
    display: inline-block;
    border-radius: 100%;
    overflow: hidden;
    // border: 1px solid #d2d6de;
    .no-tags {
       color: red !important;
    }
    svg {
        padding: 0;
    }
}
</style>

