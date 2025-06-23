let LoopUserMoudels;
function ProjectManagement(Url) {
    if(LoopUserMoudels)
    clearInterval(LoopUserMoudels);//Delete
    ShowToast(`正在加载项目!${Url}`);
    let Base_Url = "../FollowEngine_Project/"+Url;
    //Url
    let MoudelIndexUrl = `/Moudels/MoudelIndex.json`;
    let UserMoudelUrl = `/Moudels/UserMoudel.json`;
    //Let
    //let MoudelIndex = 0;
    //Bool
    let UserIndexBool = false;
    
    //这里需要先清空原有的MoudelID
    localStorage.setItem("EditorMoudelsLoad",JSON.stringify(null));
    document.getElementById("MoudelIDArray").innerHTML = "";

    ReadJSON_User(Base_Url + MoudelIndexUrl)
        .then(data => {
            UserIndexBool = true;
            console.log("读取用户JSON-模型Index:"+data.MoudelIndex);
            MoudelIndexall = 0;//停止引擎自带的moudel
            localStorage.setItem("UserMoudelIndexall",JSON.stringify(data.MoudelIndex));
            //UserMoudelIndexall = data.MoudelIndex;
        })
        .catch(err => {
            console.error("用户模型Index失败:", err);
        });
    //这里需要设置一个用户模型输入的循环
    LoopUserMoudels = setInterval(function () {
        ReadJSON_User(Base_Url + UserMoudelUrl)
            .then(data => {
                localStorage.setItem("UserMoudels",JSON.stringify(data));//写入Moudel
            })
            .catch(err => {
                console.error("用户模型读取失败:", err);
            });
    },200);//规定MoudelID以10开头-101
    
    if(UserIndexBool){
        ShowToast(`项目:${Url}加载成功！`);
    }
}