const Mock = require('mockjs')
const Random = Mock.Random

const newsData = function (e) {
    console.log(JSON.parse(e.body))

    let articles = []
    for (let i = 0; i < 10; i++) {
        let newsObj = {
            title:Random.ctitle(),
            date: Random.date(),
            display: 'list-item',
            custom_title: '自定义参数',
            custom_url: '自定义参数',
        }
        articles.push(newsObj)
    }

    articles.push({
        title:Random.ctitle(),
        date: Random.now('yyyy-MM-dd'),
        display: 'list-item',
        custom_title: '自定义参数',
        custom_url: '自定义参数',
    })

    return {
        code: 0,
        msg: "操作成功",
        data: articles,
    }

}

Mock.setup({
    timeout: 500
})

Mock.mock('/api/events', 'post',newsData )
