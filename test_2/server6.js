const fs = require("fs")
const urlLib = require('url')
const http = require('http')
const querystring = require('querystring')
 
var users={}
 
http.createServer(function(req,res){
    var obj = urlLib.parse(req.url,true)
    var url = obj.pathname
    // get
    var GET = obj.query
    // post
    var str =''
    req.on('data',function(data){
        str+=data
    })
    req.on('end',function(){
        const POST = str
    })
 
    /*区分接口、文件 */
    if(url=='/user'){   //接口
        switch(GET.act){
            case 'reg':
                // 1.检查用户名是否已经有了
                    if(users[GET.user]){
                        res.write('{"ok":false,"msg":"此用户已存在"}')
                    }else{//2.插入users
                        users[GET.user]=GET.pass
                        res.write('{"ok":true,"msg":"注册成功"}')
                    } 
                break;
            case 'login':
                // 1.检查用户是否存在
                    if(users[GET.user]==null){
                        res.write('{"ok":false,"msg":"此用户不存在"}')                        
                    }else if(users[GET.user]!=GET.pass){   //2.检查用户密码   
                        res.write('{"ok":false,"msg":"用户名或密码错误"}')
                    }else{
                        res.write('{"ok":true,"msg":"登录成功"}')
                    }
                break;
            default:
                res.write('{"ok":false,"msg":"未知的act"}')
        }
        res.end()
    }else{              //文件
        var file_name = './www'+url
        fs.readFile(file_name,function(err,data){
            if(err){
                res.write('404')
            }else{
                res.write(data)
            }
            res.end()
        })
    }
 
}).listen(8080)
