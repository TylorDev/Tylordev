import "./Request.scss";
import "./Request-mobile.scss";

import { Button } from "./../../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "./../../Components/Void/Void";
function Request() {
  const content = FetchDataComponent("requestContent");
  const data = content?.Request ?? [];

  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  const handleClick = () => {
    navigate(`/${language}/contact`);
  };

  if (!content) {
    return (
      <div className="Request">
        <div className="req-video">
          <div className="req-metadata">
            <div className="req-m-tittle">
              <Void type={"parraf"} range="8-10" lines={3} margin={0.2} />
            </div>
            <div className="req-m-meta">
              <div className="req-m-m-tittle">
                <Void type={"div"} />
              </div>

              <Void type={"parraf"} margin={0.1} />

              <Void
                id="Button"
                type={"button"}
                char={2}
                marginX={1}
                radius={5}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Request">
      <div className="req-video">
        <video loop muted autoPlay>
          <source
            src={
              "https://pixeldrain.com/api/file/Roa7NS1Z?download&recaptcha_response=03AFcWeA53jlVbzjzfcOdJRRCLmsy5-3EZkMRr2k5k11dzBpAbOTAlXlM6vWPCuojV_KlhTeT-O04N9rpNCOFk0rBA9ryAdpYgmC4qnj7xxvYM_-KjZDp2kfnvsdxmSpTYg3lNg_oYvLrxcWj8Q5env-H-crOdpoRHD9yul9DlPOlUp1T2A0Ri7DDJ8AevUsUERtx1Lq1asua8MVkdn9ulj78MxcR1uiqXTb-cQsRMmqMy8EsZ_t2Ktbo0QgNocZNd1iyNVQvC_XGhkU2jY7S2ipgZtLksGyst7nuArnVV6xF89IgGZJQanyunB4x0CNcy0Wq40kmRr0Knq_a0gen-4-wulxVFO8_lueBGty3KESPu10yRfAi5NnBatHnLM0Sui-GbqULEQcfLkpImnbAziNze8HplFFrJ-ZSj3W1-Ws6O-yng1qWy-GRdYgN_666zoRUGjYVCebMH7x3v28UGKnYaUyQe6JcpXXnDFn9_MR9vSH-eUA9nYCHPALNRyhOTaTKkaM2AVoID4XqSi90QvIKqDXZb8qqmyBybDRdhLlAaedKtorhs0yWo42pDngv4EAvbp2-OFL984M4cyH4u2Dc8AbpCgfvgT4C6y2u2NGenR3cy4hhgGLn_V5zivldCHrO31LylHY4SP0wFXr2rMk50muvTL1RgxbQCW4uKYQLm5hSCG2ThFxw3WHjHI09W1hRhVt1b09Ca4zNaO2vT8YArBt4K7r3noA"
            }
            type="video/mp4"
          />
          Tu navegador no soporta la reproducción de videos.
        </video>
        <div className="req-metadata">
          <div className="req-m-tittle">{data.title}</div>
          <div className="req-m-meta">
            <div className="req-m-m-tittle">{data.metadata.subtitle}</div>
            <p>{data.metadata.content}</p>

            <Button text={data.buttonText} handleClick={handleClick}></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Request;
