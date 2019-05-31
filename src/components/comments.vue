<template>
	<div class="content">
		<el-row class="score">
			<el-col :span="5">商品平均得分</el-col>
			<el-col :span="7">
				<el-rate v-model="avgScore" disabled show-score text-color="#ff9900">
				</el-rate>
			</el-col>
		</el-row>
		<el-radio-group v-model="radio" class="cate">
			<el-radio :label="1">全部评论</el-radio>
			<el-radio :label="2">追评</el-radio>
			<el-radio :label="3">有图</el-radio>
		</el-radio-group>
		<el-row class="comment-panel" v-for="(c4u,index) in rawComments" :key="index">
			<el-col :span="16">
				<div v-for="comment in c4u.comments" :key="comment.id">
					<el-row style="padding: 10px 0">
						<el-col :span="4" style="color: #999999;">{{comment.time}}</el-col>
						<el-col :span="18" style="font-size: 12px">{{comment.comment}}</el-col>
					</el-row>
					<div style="padding-left:90px">
						<img :src="'/img/'+img.url" v-for="(img, i ) in comment.imgs" :key="i" class="img">
					</div>
					<p v-if="comment.reply!==''" style="font-size: 12px;color: #AF874D;padding-left:90px">回复：{{comment.reply}}</p>
				</div>
			</el-col>
			<el-col :span="4"  style="padding: 10px 0;color: #999999;font-size: 12px"><span v-for="(entry,k) in c4u.sku.split(/[;；]/g)" :key="k">{{entry}}<br/></span></el-col>
			<el-col :span="4"  style="padding: 10px 0;color: #999999;font-size: 12px" >{{c4u.userName}}</el-col>
		</el-row>
	</div>
</template>

<script>
    export default {
        name: "comments",
        data() {
            return {
                avgScore: 3.7,
                radio: 1,
                rawComments: [
                    {
                        sku: "颜色：白色;尺码：185/XXL",
                        userName: "比天空更空",
                        comments: [
                            {
                                id: "1",
                                orderItemId: "1",
                                comment: "挺满意的 稍微偏大了一点点 配军绿色的羽绒服穿起来刚好很合适 弟弟蛮喜欢的",
                                reply: "非常感谢您对我们的支持！ 我们一直致力于为顾客提供优质、贴心的服务。您在产品使用过程中有任何的疑问或建议都可以告诉我们哦。再次感谢您的支持，期待您下次光临",
                                time: "2019.03.14",
                                imgs: [{url:"sweater1.jpg"}]
                            }
                        ]
                    },
                    {
                        sku: "颜色：绿色;尺码：180/XL",
                        userName: "m15234076",
                        comments: [
                            {
                                id: "2",
                                orderItemId: "2",
                                comment: "赶上年货节的优惠价，收到很快穿上很合身~喜欢",
                                reply: "",
                                time: "2019.01.19",
                                imgs: [{url:"sweater2.jpg"}]
                            }
                        ]
                    },
                    {
                        sku: "颜色：绿色;尺码：175/L",
                        userName: "李某8",
                        comments: [
                            {
                                id: "3",
                                orderItemId: "3",
                                comment: "毛衣很好",
                                reply: "",
                                time: "2018.12.09",
                                imgs: []
                            },{
                                id: "4",
                                orderItemId: "3",
                                comment: "穿了一次，就开线了什么玩意",
                                reply: "",
                                time: "2018.12.27",
                                imgs: [{url:"sweater3.jpg"}]
							}
                        ]
                    },

                ]
            }
        }
    }
</script>

<style scoped>
	.content {
		width: 800px;
		height: 100%;
		margin: 0 auto;
		font-size: 14px;
		line-height: 1.5;
	}

	.score {
		padding: 10px;
		border-bottom: 1px #c8c8c8 solid;
	}

	.cate {
		padding: 20px 0;
	}

	.img{
		width: 50px;
		height: 50px;
	}

	.comment-panel{
		border-bottom: #e3e3e3 1px solid;
		min-height: 100px;
	}
</style>
