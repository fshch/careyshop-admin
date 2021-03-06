<template>
  <div class="cs-p">
    <el-card
      class="box-card"
      shadow="never">
      <div slot="header" class="box-card-header">
        <el-row class="cs-mb-10">
          <el-col :span="18">
            <span class="text-explode">商品：</span>
            <span
              @click="handleView(tableData.get_order_goods.goods_id)"
              class="link">{{tableData.get_order_goods.goods_name}}</span>
          </el-col>

          <el-col :span="6">
            <el-rate
              :value="tableData.score"
              :disabled="true"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
            </el-rate>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <span class="text-explode">规格：</span>
            <span>{{tableData.get_order_goods.key_value}}</span>
          </el-col>

          <el-col :span="6">
            <span class="text-explode">订单号：</span>
            <span
              @click="handleOrder(tableData.order_no)"
              class="link">{{tableData.order_no}}</span>
          </el-col>

          <el-col :span="6">
            <span class="text-explode">状态：</span>
            <el-tag
              v-if="tableData.status !== null"
              :type="statusMap[tableData.status].type"
              effect="plain"
              size="mini">
              {{statusMap[tableData.status].text}}
            </el-tag>
          </el-col>
        </el-row>
      </div>

      <el-timeline>
        <!-- 主评 -->
        <el-timeline-item
          :timestamp="`[主评] ${tableData.create_time}`"
          type="primary"
          placement="top">
          <el-card shadow="never" class="action">
            <div class="user-icon">
              <el-avatar
                size="medium"
                :src="tableData.get_user.head_pic | getPreviewUrl('head_pic')">
                <img :src="`${$publicPath}image/setting/user.png`" alt=""/>
              </el-avatar>
            </div>

            <div class="problem">
              <div class="consult-content cs-pb-10">
                <span :class="{'no-content': !tableData.content}">{{tableData.content || '无评价内容'}}</span>
                <el-button
                  class="form-button active"
                  type="text"
                  size="small"
                  @click="initReplyForm(tableData.goods_comment_id)">回复</el-button>
              </div>
              <div style="line-height: 0;">
                <el-image
                  v-for="(item, index) in tableData.image"
                  :key="index"
                  class="comment_thumb"
                  :src="item | getPreviewUrl('comment_thumb_x40')"
                  :lazy="true"
                  fit="cover"
                  @click.stop="$preview(tableData.image, index)"/>
              </div>
              <div class="user-name">
                <el-popover trigger="hover" placement="top">
                  <span>{{tableData.ip_address_region}}</span>
                  <span slot="reference">{{tableData.get_user.username}}</span>
                </el-popover>
                <el-image
                  v-if="tableData.get_user.level_icon"
                  :src="tableData.get_user.level_icon"
                  class="level-icon"
                  fit="fill">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"/>
                  </div>
                </el-image>
              </div>
            </div>
          </el-card>
        </el-timeline-item>

        <!-- 主评回复 -->
        <el-timeline-item
          v-for="(item, index) in tableData.get_main_reply"
          :key="`main_reply${index}`"
          :timestamp="`[主评回复] ${item.create_time}`"
          type="danger"
          placement="top">
          <el-card shadow="never">
            <div class="user-icon">
              <el-avatar
                size="medium"
                :src="`${$publicPath}image/setting/admin.png`">
              </el-avatar>
            </div>

            <div class="problem">
              <div class="consult-content cs-pb-10">{{item.content}}</div>
              <div style="line-height: 0;">
                <el-image
                  v-for="(value, index) in item.image"
                  :key="index"
                  class="comment_thumb"
                  :src="value | getPreviewUrl('comment_thumb_x40')"
                  :lazy="true"
                  fit="cover"
                  @click.stop="$preview(item.image, index)"/>
              </div>
              <div class="user-name"><span>客服人员</span></div>
            </div>
          </el-card>
        </el-timeline-item>

        <!-- 追评 -->
        <el-timeline-item
          v-if="Object.keys(tableData.get_addition).length"
          :timestamp="`[追评] ${tableData.get_addition.create_time}`"
          type="primary"
          placement="top">
          <el-card shadow="never" class="action">
            <div class="user-icon">
              <el-avatar
                size="medium"
                :src="tableData.get_user.head_pic | getPreviewUrl('head_pic')">
                <img :src="`${$publicPath}image/setting/user.png`" alt=""/>
              </el-avatar>
            </div>

            <div class="problem">
              <div class="consult-content cs-pb-10">
                <span>{{tableData.get_addition.content}}</span>
                <el-button
                  class="form-button active"
                  type="text"
                  size="small"
                  @click="initReplyForm(tableData.get_addition.goods_comment_id)">回复</el-button>
              </div>
              <div style="line-height: 0;">
                <el-image
                  v-for="(item, index) in tableData.get_addition.image"
                  :key="index"
                  class="comment_thumb"
                  :src="item | getPreviewUrl('comment_thumb_x40')"
                  :lazy="true"
                  fit="cover"
                  @click.stop="$preview(tableData.get_addition.image, index)"/>
              </div>
              <div class="user-name">
                <el-popover trigger="hover" placement="top">
                  <span>{{tableData.get_addition.ip_address_region}}</span>
                  <span slot="reference">{{tableData.get_user.username}}</span>
                </el-popover>
                <el-image
                  v-if="tableData.get_user.level_icon"
                  :src="tableData.get_user.level_icon"
                  class="level-icon"
                  fit="fill">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"/>
                  </div>
                </el-image>
              </div>
            </div>
          </el-card>
        </el-timeline-item>

        <!-- 追评回复 -->
        <el-timeline-item
          v-for="(item, index) in tableData.get_addition_reply"
          :key="`addition_reply${index}`"
          :timestamp="`[追评回复] ${item.create_time}`"
          type="danger"
          placement="top">
          <el-card shadow="never">
            <div class="user-icon">
              <el-avatar
                size="medium"
                :src="`${$publicPath}image/setting/admin.png`">
              </el-avatar>
            </div>

            <div class="problem">
              <div class="consult-content cs-pb-10">{{item.content}}</div>
              <div style="line-height: 0;">
                <el-image
                  v-for="(value, index) in item.image"
                  :key="index"
                  class="comment_thumb"
                  :src="value | getPreviewUrl('comment_thumb_x40')"
                  :lazy="true"
                  fit="cover"
                  @click.stop="$preview(item.image, index)"/>
              </div>
              <div class="user-name"><span>客服人员</span></div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <el-form
        v-permission="'/goods/opinion/comment/detail'"
        :model="form"
        :rules="rules"
        id="reply-form"
        ref="form"
        label-width="68px">
        <el-form-item
          v-if="form.isShowReply"
          prop="content">
          <el-input
            v-model="form.content"
            placeholder="请输入回复内容"
            type="textarea"
            :autosize="{minRows: 5}"
            :show-word-limit="true"
            maxlength="200"/>

          <div style="line-height: 0;">
            <el-image
              v-for="(value, index) in form.image"
              :key="index"
              class="comment_thumb"
              style="margin: 10px 5px 0 0;"
              :src="value | getPreviewUrl('comment_thumb_x40')"
              :lazy="true"
              fit="cover"
              @click.stop="$preview(form.image, index)"/>
          </div>

          <div class="cs-mt-10">
            <el-dropdown
              :show-timeout="50"
              placement="bottom"
              @command="handleCommand">
              <el-button type="info" size="small" class="cs-mr-10">
                <span>上传图片</span>
                <i class="el-icon-arrow-down cs-pl-5"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="storage" icon="el-icon-finished">资源选择</el-dropdown-item>
                <el-dropdown-item command="upload" icon="el-icon-upload2">上传资源</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <el-button
              type="primary"
              :loading="submitLoading"
              @click="handleFormSubmit"
              size="small">提交</el-button>
          </div>
        </el-form-item>

        <cs-storage
          ref="storage"
          style="display: none;"
          @confirm="_getStorageFileList">
        </cs-storage>

        <cs-upload
          style="display: none;"
          ref="upload"
          type="slot"
          accept="image/*"
          @confirm="_getUploadFileList">
        </cs-upload>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import util from '@/utils/util'
import { replyGoodsCommentItem } from '@/api/goods/comment'

export default {
  components: {
    csUpload: () => import('@/careyshop/cs-upload'),
    csStorage: () => import('@/careyshop/cs-storage')
  },
  props: {
    tableData: {
      default: () => {}
    }
  },
  data() {
    return {
      form: {
        goods_comment_id: undefined,
        content: undefined,
        image: undefined,
        isShowReply: false
      },
      submitLoading: false,
      srcList: [null],
      rules: {
        content: [
          {
            required: true,
            message: '回复内容不能为空',
            trigger: 'blur'
          },
          {
            max: 200,
            message: '长度不能大于 200 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusMap: {
        0: {
          text: '待处理',
          type: 'warning'
        },
        1: {
          text: '已处理',
          type: 'success'
        }
      }
    }
  },
  filters: {
    getPreviewUrl(val, code) {
      if (val && (val.source || val)) {
        return util.getImageCodeUrl(val.source || val, code)
      }

      return ''
    }
  },
  methods: {
    // 资源下拉框事件
    handleCommand(command) {
      switch (command) {
        case 'storage':
          this.$refs.storage.handleStorageDlg([0, 2])
          break

        case 'upload':
          this.$refs.upload.handleUploadDlg()
          break
      }
    },
    // 获取上传资源
    _getUploadFileList(files) {
      let insert = []
      for (const value of files) {
        if (value.status !== 'success') {
          continue
        }

        const response = value.response
        if (!response || response.status !== 200) {
          continue
        }

        if (response.data) {
          if (response.data[0].type === 0) {
            insert.push({
              name: response.data[0].name,
              source: response.data[0].url
            })
          }
        }
      }

      this.form.image = insert
    },
    // 获取选择资源
    _getStorageFileList(files) {
      let insert = []
      files.forEach(value => {
        if (value.type === 0) {
          insert.push({
            name: value.name,
            source: value.url
          })
        }
      })

      this.form.image = insert
    },
    // 初始化回复框数据
    initReplyForm(id) {
      this.form.goods_comment_id = id
      this.form.content = ''
      this.form.image = []
      this.form.isShowReply = true

      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }

        const anchor = this.$el.querySelector('#reply-form')
        this.$parent.scrollTo(0, anchor.offsetTop)
      })
    },
    // 请求回复
    handleFormSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          const comment_id = this.tableData.goods_comment_id

          replyGoodsCommentItem(this.form)
            .then(res => {
              this.form.isShowReply = false
              this.$emit('reply', comment_id, res.data)
              this.$message.success('操作成功')
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
    // 打开商品预览
    handleView(goods_id) {
      this.$router.push({
        name: 'goods-admin-view',
        params: { goods_id }
      })
    },
    // 查看订单详情
    handleOrder(order_no) {
      this.$router.push({
        name: 'order-admin-info',
        params: { order_no }
      })
    }
  }
}
</script>

<style scoped>
.box-card {
  border-radius: 0;
  border: 1px solid #DCDFE6;
}

.box-card-header {
  font-size: 14px;
  color: #606266;
}

.link:hover {
  cursor: pointer;
  color: #409EFF;
  text-decoration: underline;
}

.text-explode {
  color: #909399;
}

.user-icon {
  float: left;
  width: 36px;
}

.user-name {
  color: #909399;
  font-size: 13px;
}

.problem {
  float: left;
  width: 90%;
  margin: 0 0 20px 20px;
}

.consult-content {
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  white-space: pre-wrap;
  word-wrap: break-word;
  *white-space: pre;
}

.level-icon {
  margin-left: 5px;
  line-height: 0;
  vertical-align: text-bottom;
}

.comment_thumb {
  width: 40px;
  height: 40px;
  margin: 0 5px 10px 0;
}

.comment_thumb >>> img {
  cursor: pointer;
}

.comment_thumb >>> .el-image__error {
  text-align: center;
  line-height: 1.4;
}

.form-button {
  line-height: 0;
  padding: 6px 5px;
}

.active {
  display: none;
}

.action:hover .active {
  display: inline;
}

.no-content {
  color: #C0C4CC;
}
</style>
