import css from "./ArticlesPage.module.scss";
import { BaseContext } from "../../contexts/BaseContext.tsx";
import {  useSafeContext } from "../../config.ts";
import { Container, Divider } from "@mui/material";
import SideMenu from "../../components/sideMenu/SideMenu.tsx";
import LogoBlock from "../../components/logoBlock/LogoBlock.tsx";
import FooterBlock from "../../components/footerBlock/FooterBlock.tsx";
import NavbarBlock from "../../components/narbarBlock/NavbarBlock.tsx";
import ArticleBlock from "../../components/articleBlock/ArticleBlock.tsx";

export default function ArticlesPage() {
  const { language, dictionary, allArticles} = useSafeContext(BaseContext);
  document.title = "Articles | Baikal-Amikan";

  return (
    <div className={css.root}>
      <SideMenu />
      <LogoBlock  />
      {language && dictionary ?
        <NavbarBlock links={[
          {"text": dictionary?.find((item) => (item.id === "home"))?.text[language], "href": `/${language}/`},
          {"text": dictionary?.find((item) => (item.id === "articles"))?.text[language], "href": `/${language}/activities/`},
        ]}/>: 'Loading...'}

      {language && dictionary && allArticles ? <Container maxWidth="md"  style={{ margin: "0 auto 130px" }}>
        {allArticles.map((article, index) => (
          <>
            <ArticleBlock key={`${article.id}`} version="short" article={article}/>
            {index < allArticles.length - 1 ? <Divider style={{ margin: "30px auto" }} /> : ''}
          </>
        ))}

      </Container>: 'Loading...'}
      <FooterBlock />
    </div>
  );
}
