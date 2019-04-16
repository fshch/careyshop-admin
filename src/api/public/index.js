/**
 * 获取顾客组类型
 * @returns {Promise<any>}
 */
export function getClientType() {
  return new Promise(resolve => {
    resolve({
      '1': '管理组',
      '0': '顾客组',
      '-1': '游客组'
    })
  })
}

/**
 * 获取成员组
 * @returns {Promise<any>}
 */
export function getMember() {
  return new Promise(resolve => {
    resolve({
      '1': '顾客人员',
      '2': '管理人员'
    })
  })
}

/**
 * 获取消息类型
 * @returns {Promise<any>}
 */
export function getMessageType() {
  return new Promise(resolve => {
    resolve({
      '0': '系统通知',
      '1': '公告消息',
      '2': '活动公告',
      '3': '其他消息'
    })
  })
}
