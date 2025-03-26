import React, { useState, useRef, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AddAPhoto } from "@mui/icons-material";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { grey } from "@mui/material/colors";
import mockData from "./mockdata";
import Quixote from "./genneratepdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FixedSizeList as List } from 'react-window';
const inspectionItemsInit = [
  {
    name: "车辆铭牌照片",
    code: "1.1",
    photo: [],
  },
  {
    name: "全车外观清洗，确保无污渍、油渍，驾驶室密封良好。",
    code: "1.1",
    photo: [],
  },
  {
    name: "全车锁具锁止正常，车门开合顺畅，玻璃无划痕。",
    code: "1.2",
    photo: [],
  },
  { name: "车辆结构件无弯曲、变形、断裂。", code: "1.3", photo: [] },
  { name: "电线与油管排列整齐，固定牢靠，无破损。", code: "1.4", photo: [] },
  { name: "配件、叉齿、铲齿完好，无损坏、开裂。", code: "1.5", photo: [] },

  {
    name: "发动机启动后，仪表指示稳定，处于正常范围。",
    code: "2.1",
    photo: [],
  },
  { name: "灯光检查仪表灯正常", code: "2.2", photo: [] },
  { name: "左前转向灯", code: "2.2.1", photo: [] },
  { name: "右前转向灯", code: "2.2.2", photo: [] },
  { name: "左后转向灯", code: "2.2.3", photo: [] },
  { name: "右后转向灯", code: "2.2.4", photo: [] },
  { name: "刹车灯", code: "2.2.5", photo: [] },
  { name: "倒车警示灯、刹车灯等。", code: "2.2.5", photo: [] },
  { name: "空调功能正常。", code: "2.3.1", photo: [] },
  { name: "风扇功能正常。", code: "2.3.2", photo: [] },
  { name: "雨刷功能正常。", code: "2.3.3", photo: [] },
  { name: "收音机功能正常。", code: "2.3.4", photo: [] },
  { name: "安全带等功能正常。", code: "2.3.5", photo: [] },
  { name: "仪表显示检查，预热功能、充电电压正常。", code: "2.4", photo: [] },

  { name: "动臂、摇臂、拉杆连接良好，销轴安装正常。", code: "3.1", photo: [] },
  { name: "液压泵无异响，液压管路无泄漏。", code: "3.2", photo: [] },
  {
    name: "多路阀、优先阀等液压元件固定牢固，无泄漏。",
    code: "3.3",
    photo: [],
  },
  { name: "液压操作杆顺畅，无卡滞。", code: "3.4", photo: [] },
  {
    name: "油缸极限伸缩正常，活塞表面无损伤，不漏油。",
    code: "3.5",
    photo: [],
  },
  { name: "液压散热器清洁，油箱油位正常。", code: "3.6", photo: [] },

  { name: "发动机机油量符合要求，油位正常。", code: "4.1", photo: [] },
  {
    name: "发动机启动平稳，无机油泄漏，皮带张紧正常。",
    code: "4.2",
    photo: [],
  },
  { name: "变矩器、变速箱无渗油，变速箱油清澈。", code: "4.3", photo: [] },
  // { name: "车辆驾驶平稳，挡位切换顺畅，无异常响声。", code: "4.4", photo: [] },
  // { name: "转向灵敏，方向盘操作顺畅。", code: "4.5", photo: [] },
  {
    name: "刹车油量正常，透明清澈，无泄漏，制动稳定。",
    code: "4.6",
    photo: [],
  },
  { name: "万向节间隙适中，传动轴螺栓紧固。", code: "4.7", photo: [] },
  {
    name: "刹车卡钳无异物，刹车片厚度正常，刹车盘无磨损。",
    code: "4.8",
    photo: [],
  },
  { name: "前后驱动桥螺丝紧固，标记确认。", code: "4.9", photo: [] },
  {
    name: "手刹拉线松紧适中，手刹片无过度磨损，制动力有效。",
    code: "4.10",
    photo: [],
  },
  { name: "轮胎螺栓安装方向正确，并用扭力枪紧固。", code: "4.11", photo: [] },
  { name: "装载机收音机搭铁螺丝更换", photo: [] },
  { name: "暖水阀开关", photo: [] },
  { name: "轮胎螺栓确认(圆弧面向内平面朝外)", photo: [] },
  { name: "黄油嘴加注黄油", photo: [] },
  { name: "左前轮胎压", photo: [] },
  { name: "右前轮胎压", photo: [] },
  { name: "左后轮胎压", photo: [] },
  { name: "右后轮胎压", photo: [] },
  { name: "液压油液位检查", photo: [] },
  { name: "柴油油液位检查", photo: [] },
  { name: "Picking list 属具打包", photo: [] },
  { name: "电瓶充电", photo: [] },
];

const Form = () => {
  const [invoiceId, setInvoiceId] = useState("INV-"); // 订单编号初始化为 INV-
  const [pdPerson, setPdPerson] = useState(""); // PD人员初始化为DJJ
  const [inspectionItems, setInspectionItems] = useState(inspectionItemsInit);
  const [pdfReady, setPdfReady] = useState(false); // 控制PDF生成状态
  const pdfLinkRef = useRef(null); // 添加这行
  // 获取当前日期
  const currentDate = new Date();
  // 使用 toLocaleDateString 格式化日期
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });


      // 新增工具函数：图片压缩（使用canvas）
    const compressImage = (file, quality = 0.6, maxWidth = 800) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.onerror = () => resolve(URL.createObjectURL(file)); // 压缩失败用原图
        };
        reader.readAsDataURL(file);
      });
    };

  // 修改上传处理
  const handlePhotoUpload = async (index, file) => {
    const compressedImage = await compressImage(file);
    const newItems = [...inspectionItems];
    newItems[index].photo.push(compressedImage);
    setInspectionItems(newItems);
  };


  // Handle form submission
  const handleSubmit = () => {
    setPdfReady(true); // 触发PDF生成
     if (pdfLinkRef.current) {
     pdfLinkRef.current.click(); // 模拟点击下载链接
  }

  }

  return (
    <Card>
      <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "#000000" }} aria-label="recipe">
              DJJ
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title=" DJJ Equipment"
          subheader={formattedDate}
        >
          <img src="" alt="" />
        </CardHeader>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            鲁工车辆检查表单
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{
              mb: 1,
              display: "flex",
              gap: 2, // 控制间距
              alignItems: "center",
              alignContent: "space-evenly",
            }}
            autoComplete="off"
          >
            <TextField
              label="订单编号"
              fullWidth
              variant="outlined"
              onChange={(e) => setInvoiceId(e.target.value)}
              value={invoiceId} // 确保它是动态更新的
            />
            <TextField
              label="PD人员"
              fullWidth
              variant="outlined"
              onChange={(e) => setPdPerson(e.target.value)}
              value={pdPerson} // 确保它是动态更新的
            />
          </Box>

          {inspectionItems?.map((item, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{ mb: 2, p: 2, display: "flex", alignItems: "center" }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <Typography>{item?.name}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple // 允许选择多张照片
                    capture="camera"
                    style={{ display: "none" }}
                    id={`upload-photo-${index}`}
                    onChange={(e) =>
                      handlePhotoUpload(index, e.target.files[0])
                    }
                  />
                  <label htmlFor={`upload-photo-${index}`}>
                    <Button color="primary" component="span">
                      <AddAPhoto />
                    </Button>
                  </label>
                </Grid>
                {/* Handle specific categories like Tire Pressure Check */}
                {/* Render photos for other inspection items */}
                {item?.photo && item.photo.length > 0 && (
                  <Grid container spacing={2}>
                    {item.photo.map((photo, photoIndex) => (
                      <Grid item xs={12} key={photoIndex}>
                        <img
                          src={photo}
                          alt={`Preview-${photoIndex}`}
                          style={{
                            width: "100%",
                            maxHeight: 200,
                            borderRadius: 8,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Card>
          ))}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            提交并生成PDF
          </Button>
          {/* 修改PDF下载链接部分 */}
        <div style={{ height: 0, overflow: "hidden" }}>
          <PDFDownloadLink
            document={
              <Quixote
                inspectionItems={inspectionItems}
                invoiceId={invoiceId}
                pdPerson={pdPerson}
              />
            }
            fileName={`检查报告_${invoiceId}_${new Date().toISOString().split("T")[0]}.pdf`}
            ref={pdfLinkRef}
          >
            {({ loading }) => (loading ? "正在生成PDF..." : "")}
          </PDFDownloadLink>
        </div>
        </CardContent>
      </Card>
    </Card>
  );
};

export default Form;
