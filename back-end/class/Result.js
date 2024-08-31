/**
 * 统一返回类
 */

class Result {
  constructor(code, msg, data = null) {
    this.code = code
    this.msg = msg
    this.data = data
  }

  static success(data, msg = '操作成功') {
    return new Result(200, msg, data)
  }

  static error(code = 400, msg = '操作失败', data = null) {
    return new Result(code, msg, data)
  }
}

module.exports = Result
