let LoopUserMoudels;
function ProjectManagement(Url,bool = true) {
    if(LoopUserMoudels)
    clearInterval(LoopUserMoudels);//Delete
    if(bool)
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
            console.log("读取用户JSON-模型Index:"+data[0].MoudelIndex);
            MoudelIndexall = 0;//停止引擎自带的moudel
            localStorage.setItem("UserMoudelIndexall",JSON.stringify(data[0].MoudelIndex));
            localStorage.setItem("TheNumberOfModelSegments",JSON.stringify(data[0].TheNumberOfModelSegments));
            localStorage.setItem("ModelSegmentationArray",JSON.stringify(data[1]));
            localStorage.setItem("UserProjectLoading",JSON.stringify(true));
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
                Dedicators(LoopUserMoudels);
            })
            .catch(err => {
                console.error("用户模型读取失败:", err);
            });
    },200);//规定MoudelID以10开头-101
    
    if(UserIndexBool){
        ShowToast(`项目:${Url}加载成功！`);
    }
}

function Dedicators(LoopUserMoudels){//这里会判断是否加载正确
    let GetMoudelArrayList = document.querySelectorAll(".MoudelIDArrayList").length;
    let UserMoudelIndexList = JSON.parse(localStorage.getItem("UserMoudelIndexall"));
    
    if(GetMoudelArrayList !== UserMoudelIndexList){
        console.warn("用户项目未正确加载,正在重新加载");
        clearInterval(LoopUserMoudels);//Delete
        ProjectManagement(document.getElementById("InputProjectsUrl").value,false);//此时是隐式加载不要打印了
    }
}