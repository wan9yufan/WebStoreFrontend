<template>
	<div class="content">
		<el-menu default-active="1" class="el-menu-demo" mode="horizontal">
			<el-menu-item index="1">全部商品</el-menu-item>
			<el-menu-item index="2">库存紧张</el-menu-item>
		</el-menu>
		<el-row class="info-cate">
			<el-col :span="3">
				<el-checkbox :checked="checkedItems.length===allItems.length" @change="handleCheckAllChange">全选</el-checkbox>
			</el-col>
			<el-col :span="10">商品信息</el-col>
			<el-col :span="3">单价</el-col>
			<el-col :span="2">数量</el-col>
			<el-col :span="3" style="text-align: center">金额</el-col>
			<el-col :span="3" style="text-align: center">操作</el-col>
		</el-row>
		<div class="cart" v-for="(cart, index) in carts" :key="index">
			<el-row>
				<el-checkbox class="store-bar" :checked="isStoreChecked(index)" @change="handleCheckStoreChange($event,index)">店铺：{{cart.key}}
				</el-checkbox>
			</el-row>
			<el-row v-for="item in cart.value" :key="item.id" class="cart-item">
				<el-col :span="1">
					<el-checkbox :disabled="!item.isStockEnough" :checked="checkedItems.has(item)" @change="handleCheckItemChange($event, item, index)" class="item-check"></el-checkbox>
				</el-col>
				<el-col :span="2">
					<img :src="'/img/'+item.img" width="80px">
				</el-col>
				<el-col :span="5">{{item.goodsName}}</el-col>
				<el-col :span="5">
					<div class="sku-panel">
						<span v-for="(entry,i) in item.sku.split(/[;；]/g)" :key="i">{{entry}}<br/></span>
					</div>
				</el-col>
				<el-col :span="2">￥{{item.price}}</el-col>
				<el-col :span="3">
					<el-input-number v-model="item.number" @change="handleNumberChange" :min="1" :max="10" size="mini"></el-input-number>
				</el-col>
				<el-col :span="3" style="text-align: center">￥{{item.price * item.number}}</el-col>
				<el-col :span="3" style="text-align: center">删除</el-col>
			</el-row>
		</div>
		<el-row class="pay-bar">
			<el-col :span="3" style="padding-left: 20px">
				<el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			</el-col>
			<el-col :span="13" style="color: #e5e5e5">s</el-col>
			<el-col :span="3">已购商品<span style="font-size: 16px;color: #ff4400">0</span>件</el-col>
			<el-col :span="3">合计：<span style="font-size: 18px;color: #ff4400">￥0</span></el-col>
			<el-col :span="2" class="to-pay">结算</el-col>
		</el-row>
	</div>
</template>

<script>
    export default {
        name: "cart",
        data() {
            return {
                checkAll: false,
                checkedItems: new Set(),
                carts: [
                    {
                        key: 'lilbetter旗舰店',
                        value: [{
                            id: 1,
                            storeid: 4,
                            spuid: 4,
                            skuid: '11',
                            goodsName: 'lilbetter x iG联名短袖t恤男潮半袖潮流IG战队官方应援服短袖',
                            sku: '颜色：蓝色;尺码：175/L',
                            img: 'igT.jpg',
                            price: 118.00,
                            number: 1,
                            isStockEnough: true
                        }, {
                            id: 2,
                            storeid: 4,
                            spuid: 5,
                            skuid: '11',
                            goodsName: 'Lilbetter男士毛衣 小清新时尚圆领套头上衣韩版帅气长袖针织衫男',
                            sku: '颜色：白色;尺码：180/XL',
                            img: 'knitT.png',
                            price: 89.00,
                            number: 1,
                            isStockEnough: true
                        }
                        ]
                    },
                    {
                        key: '苏宁易购官方旗舰店',
                        value: [{
                            id: 8,
                            storeid: 8,
                            spuid: 11,
                            skuid: '15125',
                            goodsName: 'Apple/苹果 iPhone XR 全网通4G手机双卡双待 苹果iPhoneXR 苹果XR 苹果xr',
                            sku: '网络类型：无需合约版;机身颜色：黑色;套餐类型：官方标配;存储容量：64GB;购买方式：裸机',
                            img: 'iphone.jpg',
                            price: 5288.00,
                            number: 1,
                            isStockEnough: false
                        }]
                    },
                    {
                        key: '潮人嘻哈新饰界',
                        value: [
                            {
                                id: 3,
                                storeid: 5,
                                spuid: 6,
                                skuid: '1924071',
                                goodsName: '韩版情侣嘻哈吊坠潮人百搭男士个性项链hip hop街头钛钢配饰',
                                sku: '颜色分类：速度与激情十字架银色钛钢[链长70cm]',
                                img: 'necklace1.jpg',
                                price: 48.00,
                                number: 1,
                                isStockEnough: true
                            },
                            {
                                id: 4,
                                storeid: 5,
                                spuid: 7,
                                skuid: '1451',
                                goodsName: '韩版情侣嘻哈吊坠潮人百搭男士个性项链hip hop街头钛钢配饰',
                                sku: '颜色分类：卡其色[太阳]',
                                img: 'necklace2.jpg',
                                price: 48.00,
                                number: 1,
                                isStockEnough: true
                            },
                            {
                                id: 5,
                                storeid: 5,
                                spuid: 8,
                                skuid: '22',
                                goodsName: '韩版情侣嘻哈吊坠潮人百搭男士个性项链hip hop街头钛钢配饰',
                                sku: '颜色分类：米白色[六芒星圆牌银色]',
                                img: 'necklace3.jpg',
                                price: 48.00,
                                number: 1,
                                isStockEnough: true
                            }
                        ]
                    },
                    {
                        key: '晶莹玲珑家居馆',
                        value: [{
                            id: 6,
                            storeid: 6,
                            spuid: 9,
                            skuid: '217548',
                            goodsName: '眠易得慢回弹记忆棉枕头修复颈椎专用成人护颈枕保健枕芯单人一对',
                            sku: '',
                            img: 'pillow.jpg',
                            price: 449.00,
                            number: 1,
                            isStockEnough: true
                        }]
                    },
                    {
                        key: '劲戈运动专营店',
                        value: [{
                            id: 7,
                            storeid: 7,
                            spuid: 10,
                            skuid: '51278',
                            goodsName: '正品2支装超轻全碳素碳纤维羽毛球拍单拍双拍训练进攻型羽拍ymqp',
                            sku: '颜色分类：【蓝绿超轻两支装】',
                            img: 'bats.jpg',
                            price: 449.00,
                            number: 1,
                            isStockEnough: true
                        }]
                    }
                ]
            }
        },
        methods: {
            handleCheckAllChange: function (checked) {
                if (checked) {
                    this.checkedItems = this.allItems
                }else
                    this.checkedItems = new Set()
            },
            handleCheckStoreChange: function (checked, index) {
                if (checked) {
                    for (let item of this.carts[index].value) {
                        this.checkedItems.add(item)
                    }
                } else {
                    for (let item of this.carts[index].value) {
                        this.checkedItems.delete(item)
                    }
                }
            },
            // handleCheckItemChange: function (checked, item, index) {
			// 	if(checked) {
			//
			// 	}
            // },
            handleNumberChange: function () {

            },
            isStoreChecked: function () {

            }
        },
        computed: {
            shortageCarts: function () {
                let shortCart = []
                let items
                for (let cart of this.carts) {
                    items = []
                    for (let item of cart.value) {
                        if (!item.isStockEnough) {
                            items.push(item)
                        }
                    }
                    shortCart.push({key: cart.key, value: items})
                }
                return shortCart
            },
			allItems: function () {
				let items = []
				for(let cart of this.carts)
					for(let item of cart.value)
						items.push(item)
				return new Set(items)
            }
        },
        created() {
            // for (let i = 0; i < this.carts.length; i++) {
            //     this.checkedItems.push([]);
            // }
        }

    }
</script>

<style scoped>
	div.content {
		width: 1080px;
		height: 100%;
		margin: 0 auto;
		font-size: 14px;
	}

	.pay-bar {
		line-height: 50px;
		position: fixed;
		bottom: 0;
		z-index: 5;
		background-color: #e5e5e5;
		width: 1080px;
	}

	.info-cate {
		line-height: 50px;
		margin-bottom: 20px;
	}

	.cart {
		margin-bottom: 30px;
		font: 12px/1.5 tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
	}

	.store-bar {
		padding-left: 8px;
	}

	.cart-item {
		background-color: #fcfcfc;
		border-left: #cccccc 1px solid;
		border-right: #cccccc 1px solid;
		border-top: #cccccc 1px solid;
		padding: 15px 0;
	}

	.cart-item:last-of-type {
		border-bottom: #cccccc 1px solid;
	}

	.sku-panel {
		padding-left: 40px;
		padding-right: 20px;
	}

	.to-pay {
		font-size: 18px;
		color: white;
		background-color: #b0b0b0;
		text-align: center;
	}

	.item-check {
		float: right;
		padding-right: 8px;
	}
</style>
