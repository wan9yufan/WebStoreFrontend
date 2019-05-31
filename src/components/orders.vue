<template>
	<div class="content">
		<el-menu @select="select" default-active="1" class="el-menu-demo" mode="horizontal">
			<el-menu-item index="1">全部订单</el-menu-item>
			<el-menu-item index="2">待付款</el-menu-item>
			<el-menu-item index="3">待发货</el-menu-item>
			<el-menu-item index="4">待收货</el-menu-item>
			<el-menu-item index="5">待评价</el-menu-item>
			<el-submenu index="6">
				<template slot="title">售后订单</template>
				<el-menu-item index="6-1">退货中</el-menu-item>
				<el-menu-item index="6-2">退款成功</el-menu-item>
			</el-submenu>
		</el-menu>

		<table class="order-info-cate">
			<tr>
				<th class="col1">商品</th>
				<th class="col2">单价</th>
				<th class="col3">数量</th>
				<th class="col4">商品操作</th>
				<th class="col5">实付款</th>
				<th class="col6">交易状态</th>
				<th class="col7">交易操作</th>
			</tr>
		</table>

		<table v-for="order in selectedOrders" :key="order.id">
			<tr>
				<td class="order-info-td">
					<span class="order-create-time">{{order.time}}</span>
					订单号：<span>{{order.id}}</span>
				</td>
				<td colspan="3" class="order-store-td">
					<a href="">{{order.storeName}}</a>   <!--to do-->
				</td>
				<td colspan="2"></td>
				<td><a class="order-delete-btn"><img src="../assets/delete.svg"></a></td>
			</tr>
			<tr v-for="item in order.items" :key="item.id">
				<td class="col1">
					<div class="order-item-info">
						<img :src="'/img/'+item.img">          <!--to do-->
						<span>{{item.name}}</span><br/>
						<span class="order-item-detail">{{item.sku.replace(/;|；/g," ")}}</span>
					</div>
				</td>
				<td class="col2">￥{{item.price}}</td>
				<td class="col3">{{item.number}}</td>
				<td class="col4"><span v-if="order.status>=5" @click="successMessage('to do')" style="cursor: pointer">申请退货</span>
				</td>
				<td class="col5" v-if="item.id === order.items[0].id" :rowspan="order.items.length">￥{{order.money}}
				</td>
				<td class="col6" v-if="item.id === order.items[0].id" :rowspan="order.items.length">
					<span v-if="order.status>4">交易成功</span>
					<span v-else-if="order.status===-1">退货中</span>
					<span v-else-if="order.status<=0">交易关闭</span>
					<span v-else-if="order.status===1">等待买家付款</span>
					<span v-else-if="order.status===4">等待买家收货</span>
					<span v-else>等待货物送达</span>
					<br/>
					<span @click="successMessage('to do')" style="cursor: pointer">订单详情</span>
				</td>
				<td class="col7" v-if="order.status<5||order.commented||item.id === order.items[0].id"
					:rowspan="order.status>=5&&!order.commented&&item.id === order.items[0].id?order.items.length:1">
					<span v-if="order.status>=5&&!order.commented" @click="commentPanel=true;commentsInit(order)" style="cursor: pointer">评论</span>
					<span v-if="order.status>=5&&order.commented" @click="commentPanel=true" style="cursor: pointer">追加评论</span>
					<!--to do-->
					<span v-if="order.status===1">
						<el-button size="mini" @click="payPanel=true;presentOrder=order">立即付款</el-button><br/>
						<span @click="successMessage('订单取消成功')" style="cursor: pointer">取消订单</span>
					</span>
					<span v-if="order.status===2" @click="successMessage('退款成功')" style="cursor: pointer">退款</span>
					<el-button size="mini" v-if="order.status===4" @click="successMessage('确认收货成功')" style="cursor: pointer">确认收货
					</el-button>
				</td>
			</tr>
		</table>

		<el-dialog title="评价" :visible.sync="commentPanel" width="800px">
			<el-form :model="commentForm" label-width="80px">
				<div class="item-comment" v-for="(goods, index) in presentOrder.items" :key="index">
					<img :src="'/img/'+goods.img" class="comment-img">
					<div class="comment-detail">
						<el-form-item label="商品打分">
							<el-rate v-model="commentForm.comments[index].score" style="display: inline;vertical-align: text-top"></el-rate>
						</el-form-item>
						<el-form-item label="使用感受" style="display: inline-block;width:500px">
							<el-input type="textarea" v-model="commentForm.comments[index].comment" maxlength="200" show-word-limit></el-input>
						</el-form-item>
					</div>
				</div>
				<el-divider></el-divider>
				<el-form-item label="服务打分">
					<el-rate v-model="commentForm.service_score" style="display: inline;vertical-align: text-top"></el-rate>
				</el-form-item>
				<el-form-item label="物流打分">
					<el-rate v-model="commentForm.transport_score" style="display: inline;vertical-align: text-top"></el-rate>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="commentPanel = false">取 消</el-button>
				<el-button type="primary" @click="commentPanel = false">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="支付" :visible.sync="payPanel" width="700px">
			<el-form inline="true" label-width="80" style="width: 600px">
				<p>金额：￥{{presentOrder.money}}</p>
						<el-form-item label="支付密码">
							<el-input type="password" v-model="payCode" show-password></el-input>
						</el-form-item>
				<div style="display: inline-block;float: right">
					<el-button @click="payPanel = false">取 消</el-button>
					<el-button type="primary" @click="payPanel = false">确 定</el-button>
				</div>
			</el-form>
		</el-dialog>

	</div>
</template>

<script>
    // import cookie from "js-cookie"

    export default {
        name: 'orders',
        data() {
            return {
                payPanel: false,
                commentPanel: false,
                detailOrderPanel: false,
                selectedOrders: [],
                rawOrders: [],
                presentOrder: {},
                commentForm: {
                    service_score: 5,
                    transport_score: 5,
                    comments: [{}]
                },
                payCode: '',
                orders: {
                    //待付款
                    o1: [],
                    //待发货
                    o2: [],
                    //待接收
                    o4: [],
                    //待评论
                    o5: [],
                    //退货中
                    o7: [],
                    //退款成功
                    o8: []
                }
            }
        },
        created() {
            // let userid = cookie.get("userid");
            // axios.get("http://localhost:8024/showOrders?userid=" + userid)
            //     .then(response => {
            //         this.rawOrders = response.data
            //     })
            // this.rawOrders = [
            //     {
            //         id: 1,
            //         userid: 1,
            //         storeid: 1,
            //         storeName: "雷蛇官方旗舰店",
            //         store: null,
            //         address: null,
            //         time: "2019-05-23",
            //         money: 899.00,
            //         status: 1,
			// 		commented: false,
            //         items: [{
            //             id: 1,
            //             spuid: 1,
            //             name: "雷蛇键盘",
            //             sku: "颜色：白色",
            //             img: "keyboard.jpg",
            //             price: 899.00,
            //             number: 1
            //         }]
            //     },
            //     {
            //         id: 2,
            //         userid: 1,
            //         storeid: 2,
            //         storeName: "班迪维旗舰店",
            //         store: null,
            //         address: null,
            //         time: "2019-02-02",
            //         money: 114.49,
            //         status: 5,
            //         commented: false,
            //         items: [{
            //             id: 2,
            //             spuid: 2,
            //             name: "男士长袖t恤圆领纯色修身韩版百搭青年白色春秋薄款打底衫男体恤 ",
            //             sku: "颜色：白色；尺码：XL",
            //             img: "whiteT.jpg",
            //             price: 57.24,
            //             number: 1
            //         }, {
            //             id: 3,
            //             spuid: 2,
            //             name: "男士长袖t恤圆领纯色修身韩版百搭青年白色春秋薄款打底衫男体恤 ",
            //             sku: "颜色：黑色；尺码：XL",
            //             img: "blackT.jpg",
            //             price: 57.24,
            //             number: 1
            //         }]
            //     }
            //     ,
            //     {
            //         id: 3,
            //         userid: 1,
            //         storeid: 3,
            //         storeName: "it之家书社",
            //         store: null,
            //         address: null,
            //         time: "2018-11-11",
            //         money: 33.13,
            //         status: 5,
			// 		commented: true,
            //         items: [{
            //             id: 4,
            //             spuid: 3,
            //             name: "深入理解Java虚拟机JVM高级特性+Java多线程编程",
            //             sku: "",
            //             img: "books.png",
            //             price: 33.13,
            //             number: 1
            //         }]
            //     }
            // ]
			this.$axios.get("http://localhost:8024/showOrders?userid=1")
				.then(response=> {
                    this.rawOrders = response.data
					this.selectedOrders=response.data
                })
				.catch(function (error) {
					alert(error.toString())
                })
        },
        methods: {
            select: function (index) {
                switch (index) {
                    case "1":
                        this.selectedOrders = this.rawOrders
                        break
                    case "2":
                        this.selectedOrders = this.orders.o1
                        break
                    case "3":
                        this.selectedOrders = this.orders.o2
                        break
                    case "4":
                        this.selectedOrders = this.orders.o4
                        break
                    case "5":
                        this.selectedOrders = this.orders.o5
                        break
                    case "6-1":
                        this.selectedOrders = this.orders.o7
                        break
                    case "6-2":
                        this.selectedOrders = this.orders.o8
                        break
                }
            },
            successMessage: function (message) {
                this.$message({
                    showClose: true,
                    message: message,
                    type: 'success'
                })
            },
            commentsInit: function (o) {
                this.presentOrder = o;
                this.commentForm = {
                    service_score: 5,
                    transport_score: 5,
                    comments: []
                }
                for (let i = 0; i < o.items.length; i++) {
                    this.commentForm.comments.push({
                        score: 5,
                        comment: ''
                    })
                }
            }
        },
        watch: {
            rawOrders: function (val) {
                this.orders.o1 = []
                this.orders.o2 = []
                this.orders.o4 = []
                this.orders.o5 = []
                this.orders.o7 = []
                this.orders.o8 = []
                for (let order of val) {
                    switch (order.status) {
                        case 1:
                            this.orders.o1.push(order)
                            break
                        case 2:
                            this.orders.o2.push(order)
                            break
                        case 3:
                        case 4:
                            this.orders.o4.push(order);
                            break
                        case 5:
                        case 6:
                            this.orders.o5.push(order)
                            break
                        case -1:
                            this.orders.o7.push(order)
                            break
                        case -2:
                            this.orders.o8.push(order)
                            break
                    }
                }
            }
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

	table {
		width: 100%;
		box-sizing: border-box;
		text-align: center;
		border: 1px #ececec solid;
		border-collapse: collapse;
		margin: 20px 0;
	}

	td.col1, td.col2, td.col3, td.col4, td.col5, td.col6, td.col7 {
		padding: 10px 0;
	}

	.col1 {
		width: 40%;
	}

	.col2, .col5 {
		width: 9%;
	}

	.col3 {
		width: 6%;
	}

	.col4, .col6, .col7 {
		width: 12%;
	}

	.col1, .col2, .col3, .col4, .col7 {
		border-bottom: 1px #ececec solid;
	}

	.col5, .col6, .col7 {
		border-left: 1px #ececec solid;
		border-right: 1px #ececec solid;
	}

	.order-create-time {
		margin-right: 10px;
	}

	a {
		text-decoration: none !important;
		color: inherit !important;
	}

	table tr:first-of-type {
		background: #f1f1f1;
		line-height: 36px;
	}

	td {
		vertical-align: text-top;
	}

	table:not(.order-info-cate) tr:first-of-type {
		text-align: left;
	}

	.order-info-td, .order-store-td {
		padding-left: 25px;
	}

	.order-delete-btn img {
		margin-left: 50px;
		display: inline-block;
		vertical-align: middle;
		width: 18px;
	}

	.order-item-info img {
		width: 80px;
		height: 80px;
		margin: 0 10px 0 20px;
		float: left;
	}

	.order-item-info {
		text-align: left;
	}

	.order-item-info span {
		margin: 8px 0;
	}

	.order-item-detail {
		font-size: 12px;
		color: #9e9e9e;
		font-family: SimSun,serif;
	}

	.comment-img {
		float: left;
		margin-right: 20px;
	}

	.comment-detail {
		float: left;
	}

	.item-comment {
		overflow: hidden;
	}
</style>
