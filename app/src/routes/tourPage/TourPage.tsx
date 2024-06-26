import { Alert, Button, Container, Divider, Modal, Paper, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {FILES_PATH, getData, useSafeContext} from "../../config.ts";
import { BaseContext, iReview, iTour } from "../../contexts/BaseContext.tsx";
import css from "./TourPage.module.scss";
import PicturesBlock from "../../components/picturesBlock/PicturesBlock.tsx";
import LogoBlock from "../../components/logoBlock/LogoBlock.tsx";
import SideMenu from "../../components/sideMenu/SideMenu.tsx";
import FooterBlock from "../../components/footerBlock/FooterBlock.tsx";
import NavbarBlock from "../../components/narbarBlock/NavbarBlock.tsx";
import ReviewBlock from "../../components/reviewBlock/ReviewBlock.tsx";
import SendEmailBlock from "../../components/sendEmailBlock/SendEmailBlock.tsx";
import FadeInBlocks from "../../components/fadeInBlocks/FadeInBlocks.tsx";

export default function TourPage() {
  const { language, setLanguage, dictionary, allActivities, allPlaces, allTours, allReviews } =
    useSafeContext(BaseContext);

  const [tour, setTour] = useState<iTour | null>(null);
  const [reviews, setReviews] = useState<Array<iReview> | null>(null);
  const { lang } = useParams<{ lang: "en" | "ru" }>();
  const { tourId } = useParams<string>();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (!lang && language) {
      window.location.href = `/${language}`;
    } else if (lang && language !== lang) {
      setLanguage(lang);
    }
  }, [language, lang, setLanguage]);

  useEffect(() => {
    let ignore = false;
    if (!tour && tourId && language) {
      if (allTours) {
        const found = allTours.find((item) => item.id === tourId);
        if (found) {
          setTour(found);
          document.title = `${found.title[language]} | Baikal-Amikan`;
        }
      } else {
        getData(`/tours/${tourId}/data.json`).then((result: iTour) => {
          if (!ignore) {
            setTour(result);
            document.title = `${result.title[language]} | Baikal-Amikan`;
          }
        });
      }
    }
    return () => {
      ignore = true;
    };
  }, [allTours, language, tour, tourId]);

  useEffect(() => {
    if (tourId && !reviews && allReviews) {
      const filteredReviews = allReviews.filter((item) => item.tourId === tourId);
      setReviews(filteredReviews);
    }
  }, [tourId, reviews, allReviews]);

  return (
    <div className={css.container}>
      <SideMenu />
      <LogoBlock />

      {language && dictionary && tour ? (
        <NavbarBlock
          links={[
            { text: dictionary?.find((item) => item.id === "home")?.text[language], link: `/${language}/` },
            { text: dictionary?.find((item) => item.id === "tours")?.text[language], link: `/${language}/tours/` },
            { text: tour.title[language], link: `${language}/tours/${tour.id}` },
          ]}
        />
      ) : (
        "Loading..."
      )}

      {tour ? (
        <Paper
          elevation={3}
          className={css.cover}
          style={{ backgroundImage: `url(${FILES_PATH}/${tour.cover})`, margin: "0 0 50px 0" }}
        />
      ) : (
        ""
      )}

      {tour && language && dictionary && allActivities && allPlaces ? (
        <Container maxWidth="md" style={{ marginBottom: "100px" }}>
          <Modal
            aria-labelledby={tour.id}
            aria-describedby={`Book a ${tour.title[language]} tour form`}
            open={modalIsOpen}
            onClose={() => setModalIsOpen(false)}
            sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <div>
              <SendEmailBlock tourId={tour.id} type={"tour"} />
              <Button>Close</Button>
            </div>
          </Modal>

          <Typography variant="h4">{tour.title[language]}</Typography>
          <Typography variant="body1" align="left" paragraph style={{ marginBottom: "40px" }}>
            {tour.months[language]} | {tour.duration[language]}
          </Typography>

          <Paper elevation={3}>
            <Alert severity="info" icon={false} className={css.descriptionCard}>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: "20px 0px 5px" }}
                onClick={() => setModalIsOpen(true)}
              >
                {dictionary.find((item) => item.id === "bookTour")?.text[language]}
              </Button>
              <Typography
                variant="body1"
                align="left"
                dangerouslySetInnerHTML={{ __html: tour.description[language] }}
              />
              <Typography
                variant="caption"
                align="left"
                paragraph
                style={{ marginBottom: "5px", lineHeight: "1.5rem" }}
              >
                {tour.activities.map((id) => {
                  const activity = allActivities.find((item) => item.id === id);
                  return (
                    <Link
                      key={`activity-${id}`}
                      to={`/${language}/activities/${activity?.id}`}
                      className={css.activityLabel}
                    >
                      {activity?.title[language]}
                    </Link>
                  );
                })}
              </Typography>
              <Typography variant="caption" align="left" paragraph style={{ lineHeight: "1.5rem" }}>
                {tour.places.map((id) => {
                  const place = allPlaces.find((item) => item.id === id);
                  return (
                    <Link key={`place-${id}`} to={`/${language}/places/${place?.id}`} className={css.placeLabel}>
                      {place?.title[language]}
                    </Link>
                  );
                })}
              </Typography>
            </Alert>
          </Paper>

          {tour.media && tour.media.pictures && tour.media.pictures.length > 0 ? (
              <PicturesBlock variant="standard" pictures={tour.media.pictures.map((pic) => ({ title: pic.title? pic.title[language]: null, url: `${FILES_PATH}/${pic.src}`}))} />
          ) : (
              ""
          )}

          <FadeInBlocks
            columns={1}
            blocks={tour.days.map((day, index) => {
              return (
                <div key={index} className={css.dayCard}>
                  <Typography variant="h4">
                    {dictionary.find((item) => item.id === "day")?.text[language]} {day.order}. {day.title[language]}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="left"
                    paragraph
                    dangerouslySetInnerHTML={{ __html: day.description[language] }}
                  />
                  {day.pictures.length > 0 ? (
                    <PicturesBlock pictures={day.pictures.map((pic) => ({ title: pic.title? pic.title[language]: null, url: `${FILES_PATH}/${pic.src}`}))} />
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          />
          <Paper elevation={3}>
            <Alert severity="info" className={css.priceCard} icon={false}>
              {tour.note ? (
                <>
                  <Typography
                    variant="body1"
                    align="left"
                    dangerouslySetInnerHTML={{ __html: tour.note[language] }}
                  />
                  <Divider style={{ margin: "20px 0" }} />
                </>
              ) : (
                ""
              )}

              {tour.price ? (
                <>
                  <Typography variant="h5">{dictionary.find((item) => item.id === "price")?.text[language]}</Typography>
                  {tour.price.map((price, index) => (
                    <Typography
                      variant="body1"
                      key={`price-${index}`}
                      dangerouslySetInnerHTML={{ __html: `${price[language]} <b>${price.price}</b>` }}
                    />
                  ))}
                </>
              ) : (
                ""
              )}

              {tour.includes ? (
                <>
                  <Typography variant="subtitle1">
                    {dictionary.find((item) => item.id === "includes")?.text[language]}
                  </Typography>
                  <ul>
                    <Typography variant="body1" align="left" paragraph>
                      {tour.includes.map((include, index) => {
                        return <li key={`include-${index}`}> {include[language]}</li>;
                      })}
                    </Typography>
                  </ul>
                </>
              ) : (
                ""
              )}

              {tour.notIncludes ? (
                <>
                  <Typography variant="subtitle1">
                    {dictionary.find((item) => item.id === "notIncludes")?.text[language]}
                  </Typography>
                  <ul>
                    <Typography variant="body1" align="left" paragraph>
                      {tour.notIncludes.map((notInclude, index) => {
                        return <li key={`notInclude-${index}`}> {notInclude[language]}</li>;
                      })}
                    </Typography>
                  </ul>
                </>
              ) : (
                ""
              )}

              <Button
                variant="contained"
                color="primary"
                style={{ margin: "5px 0px 20px" }}
                onClick={() => setModalIsOpen(true)}
              >
                {dictionary.find((item) => item.id === "bookTour")?.text[language]}
              </Button>
            </Alert>
          </Paper>

          {tour.media && tour.media.video
              ? (
                  <div key={`video-${tour.id}`} className={css.videoPreview}>
                    <div dangerouslySetInnerHTML={{ __html: `${tour.media.video.src}` }} />
                    {tour.media.video.description ? (
                        <Typography
                            variant="caption"
                            align="center"
                            style={{ margin: "0 auto 20px auto" }}
                            dangerouslySetInnerHTML={{ __html: tour.media.video.description[language] }}
                        />
                    ) :  ("")}
                  </div>
              ) : ""}

          {reviews ? (
            <>
              {reviews.map((review, index) => (
                <ReviewBlock review={review} key={`review-${index}`} />
              ))}
            </>
          ) : (
            ""
          )}
        </Container>
      ) : (
        <div>Loading...</div>
      )}
      <FooterBlock />
    </div>
  );
}
