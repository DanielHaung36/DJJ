import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import mockData from "./mockdata";
import Fangsong from "../assets/font/ZiTiGuanJiaFangSongTi-2.ttf";

// 页面尺寸和边距
const PAGE = {
  height: 842, // A4高度（默认单位：点）
  paddingTop: 35,
  paddingBottom: 65,
  paddingHorizontal: 35,
};
const CONTENT_HEIGHT = PAGE.height - PAGE.paddingTop - PAGE.paddingBottom;

const Quixote = (props) => {
  const pages = [];
  let currentPageContent = [];
  let currentPageHeight = 0;
  let isFirstPage = true;
  // 使用传入的inspectionData而不是直接导入的mockData
  const data = props.inspectionItems || mockData;
  // const data = inspectionData;
  console.log(props);
  // 获取当前的具体时间，格式化为“YYYY-MM-DD HH:mm:ss”
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }); // 使用当前的日期和时间
  // 添加标题和作者（仅第一页）
  const header = (
    <React.Fragment key="header">
      <Text style={styles.title}>鲁工PD检查清单</Text>
      <View key="author" style={styles.authorcontainer}>
        <Text style={styles.author}>InvoiceId: {props.invoiceId}</Text>
        <Text style={styles.author}>检查负责工程师：{props.pdPerson}</Text>
        <Text style={styles.text}>检查时间: {formattedDate}</Text>
      </View>
    </React.Fragment>
  );

  // 如果是第一页，添加标题
  if (isFirstPage) {
    const headerHeight = 24 + 12 + 40; // 标题+作者+边距
    currentPageContent.push(header);
    currentPageHeight += headerHeight;
  }

  // 添加新页面函数
  const addNewPage = (content) => {
    pages.push(
      <Page key={pages.length} style={styles.body}>
        {content}
      </Page>
    );
    currentPageContent = [];
    currentPageHeight = 0;
    isFirstPage = false; // 后续页面标记为非第一页
  };

  // 处理每个检查项
  data.forEach((item, index) => {
    // 计算当前项高度（标题+图片+边距）
    const titleHeight = 18 + 24; // 副标题字体大小+边距
    const imageHeight = 200; // 固定图片高度
    const sectionMargin = 20;
    const sectionHeight = titleHeight + imageHeight + sectionMargin;

    // 如果当前页面剩余空间不足
    if (currentPageHeight + sectionHeight > CONTENT_HEIGHT) {
      // 先保存当前页面内容
      addNewPage([...currentPageContent]);

      // 然后添加当前检查项到新页面
      currentPageContent.push(
        <View key={index} style={styles.section}>
          <Text style={styles.subtitle}>{item.name}</Text>
          <View style={styles.imageContainer}>
            {item.photo &&
              item.photo.map((url, idx) => (
                <Image key={url + idx} style={styles.singleImage} src={url} />
              ))}
          </View>
        </View>
      );
      currentPageHeight = sectionHeight; // 新页面当前高度
    } else {
      // 当前页面有足够空间，直接添加
      currentPageContent.push(
        <View key={index} style={styles.section}>
          <Text style={styles.subtitle}>{item.name}</Text>
          <View style={styles.imageContainer}>
            {item.photo &&
              item.photo.map((url, idx) => (
                <Image key={url + idx} style={styles.singleImage} src={url} />
              ))}
          </View>
        </View>
      );
      currentPageHeight += sectionHeight;
    }
  });

  // 添加最后一页内容
  if (currentPageContent.length > 0) {
    addNewPage(currentPageContent);
  }

  return <Document>{pages}</Document>;
};

Font.register({ family: "Noto Sans SC", src: Fangsong });

const styles = StyleSheet.create({
  body: {
    paddingTop: PAGE.paddingTop,
    paddingBottom: PAGE.paddingBottom,
    paddingHorizontal: PAGE.paddingHorizontal,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Noto Sans SC",
    marginBottom: 12,
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Noto Sans SC",
  },
  text: {
    marginTop: 12,
    fontSize: 10,
    textAlign: "center",
    fontFamily: "Noto Sans SC",
  },
  authorcontainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Noto Sans SC",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
    fontFamily: "Noto Sans SC",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  imageContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  singleImage: {
    width: "75%",
    height: 200,
    marginBottom: 10,
  },
});

export default Quixote;
