const { httpClient } = require('../../../utils/util.js')

Page({

  data: {
    memberAddressBean: {}
  },

  async onLoad(options) {
    const longId = options.longId
    if (longId) {
      const result = await httpClient("/member-address/detail", { longId: longId })
      this.setData({ memberAddressBean: result.objData || {} })
    }
  },

  changeNickname(e) {
    const strNickname = e.detail.value
    this.setData({ "memberAddressBean.strNickname": strNickname })
  },

  changeCellphone(e) {
    const strCellphone = e.detail.value
    this.setData({ "memberAddressBean.strCellphone": strCellphone })
  },

  changeDetailAddress(e) {
    const strDetailAddress = e.detail.value
    this.setData({ "memberAddressBean.strDetailAddress": strDetailAddress })
  },

  async saveAddress() {
    await httpClient("/member-address/save", this.data.memberAddressBean)
    wx.navigateBack()
  },

  openMap() {
    wx.chooseLocation({
      success: (e) => {
        const address = this.parseRegionAddress(e.address)
        this.data.memberAddressBean.strProvinces = address.provinceName
        this.data.memberAddressBean.strCity = address.cityName
        this.data.memberAddressBean.strDistrict = address.districtName
        this.data.memberAddressBean.strDetailAddress = address.detailAddress
        this.setData({ memberAddressBean: this.data.memberAddressBean })
      },
    })
  },

  parseRegionAddress(address = '') {
    const result = {
      provinceName: '',
      cityName: '',
      districtName: '',
      detailAddress: '',
    }

    let rest = String(address || '').trim().replace(/\s+/g, '')
    if (!rest) return result

    const directMunicipalities = ['北京市', '天津市', '上海市', '重庆市']
    const firstSuffixes = ['特别行政区', '自治区', '省', '市']
    const secondSuffixes = ['自治州', '地区', '盟', '市']
    const thirdSuffixes = ['市辖区', '自治旗', '自治县', '县级市', '林区', '特区', '自治州', '旗', '县', '区', '市']

    const consume = (text, suffixes) => {
      const sortedSuffixes = [...suffixes].sort((a, b) => b.length - a.length)
      for (const suffix of sortedSuffixes) {
        const idx = text.indexOf(suffix)
        if (idx > -1) {
          return text.slice(0, idx + suffix.length)
        }
      }
      return ''
    }

    const direct = directMunicipalities.find((item) => rest.startsWith(item))
    if (direct) {
      result.provinceName = direct
      result.cityName = direct
      rest = rest.slice(direct.length)
    } else {
      const first = consume(rest, firstSuffixes)
      if (first) {
        result.provinceName = first
        rest = rest.slice(first.length)
      }
    }

    let second = consume(rest, secondSuffixes)
    if (direct) {
      second = ''
    } else if (second) {
      result.cityName = second
      rest = rest.slice(second.length)
    }

    let third = consume(rest, thirdSuffixes)
    if (third === '市辖区') {
      rest = rest.slice(third.length)
      third = consume(rest, thirdSuffixes)
    }
    if (third) {
      result.districtName = third
      rest = rest.slice(third.length)
    }

    result.detailAddress = rest
    return result
  },
})
