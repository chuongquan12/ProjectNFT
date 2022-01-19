import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import contract from "./contracts/Project.json";

import Web3 from "web3";
import Project from "Project";

import { Button, Row, Col, Tabs } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import { dataAvatar } from "./assets/data";

const { TabPane } = Tabs;
const abi = contract.abi;

const App = () => {
  const {
    authenticate,
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    isWeb3EnableLoading,
  } = useMoralis();
  const [currentAccount, setCurrentAccount] = useState(null);
  const [dataAvatarRandom, setDataAvatarRandom] = useState(
    randomReviewAvatar()
  );

  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    checkWalletIsConnected();
  }, [isAuthenticated, isWeb3Enabled]);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const handleChangeImg = (valueIndex, elementIndex) => {
    let temp = [...dataAvatarRandom];

    temp.map((value) => {
      if (value.key == valueIndex + 1) value.img = elementIndex;
    });

    setDataAvatarRandom(temp);
  };

  const handleCreateAvatar = async () => {
    const string = stringAvatar(dataAvatarRandom);
    console.log(string);
    await Project.methods.createAvatar(string).send({ from: currentAccount });
  };

  return (
    <Row justify="center" align="middle">
      <Col xs={16}>
        <Row>
          <Col xs={24}>
            <h1>Pick your Avatars</h1>
          </Col>
          <Col xs={24}>
            <p>
              Users who hold Drawing boards can freely create their own
              personalized avatars!
            </p>
          </Col>
        </Row>
        <Row>
          <Button
            onClick={async () => {
              try {
                await authenticate({ provider: "injected" });
                window.localStorage.setItem("connectorId", "injected");
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Connect Metamask
          </Button>
        </Row>
        <Row>
          <Col xs={18}>
            <Tabs defaultActiveKey="0" tabPosition={"left"}>
              {dataAvatar.map((value, valueIndex) => {
                return (
                  <TabPane tab={value.tabLabel} key={value.key}>
                    <Row justify="start">
                      {value.dataImg.map((element, elementIndex) => {
                        return (
                          <Col
                            xs={8}
                            key={element.key}
                            onClick={() =>
                              handleChangeImg(valueIndex, elementIndex)
                            }
                          >
                            <img src={element.url} alt={element.name} />
                          </Col>
                        );
                      })}
                    </Row>
                  </TabPane>
                );
              })}
            </Tabs>
          </Col>
          <Col xs={6}>
            <Row>
              {dataAvatarRandom.map((value) => {
                return (
                  <img
                    className="img-review"
                    src={dataAvatar[value.key - 1].dataImg[value.img].url}
                    alt={dataAvatar[value.key - 1].dataImg[value.img].alt}
                  />
                );
              })}
            </Row>
            <Row justify="center">
              <Button
                className="btn-create"
                onClick={() => handleCreateAvatar()}
              >
                Create Avatar
              </Button>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const randomReviewAvatar = () => {
  let str = "";
  let obj = [];
  for (let i = 0; i < 16; i++) {
    str = str + Math.floor(Math.random() * 10);
  }

  for (let i = 6; i > 0; i--) {
    let temp = str.substring(i * 2 - 2, i * 2);

    switch (i) {
      case 1:
        obj.push({ key: i, name: "HAIR", img: temp % 5 });
        break;
      case 2:
        obj.push({ key: i, name: "TOOTH", img: temp % 5 });
        break;
      case 3:
        obj.push({ key: i, name: "HAND", img: temp % 5 });
        break;
      case 4:
        obj.push({ key: i, name: "CLOTHES", img: temp % 6 });
        break;
      case 5:
        obj.push({ key: i, name: "EYE", img: temp % 6 });
        break;
      default:
        obj.push({ key: i, name: "BR", img: temp % 7 });
        break;
    }
  }

  return obj;
};

const stringAvatar = (data) => {
  let str = "";

  for (let i = data.length - 1; i >= 0; i--) {
    switch (data[i].key) {
      case 1:
        str = str + (2 * 5 + data[i].img);
        break;
      case 2:
        str = str + (2 * 5 + data[i].img);
        break;
      case 3:
        str = str + (2 * 5 + data[i].img);
        break;
      case 4:
        str = str + (2 * 6 + data[i].img);
        break;
      case 5:
        str = str + (2 * 6 + data[i].img);
        break;
      default:
        str = str + (2 * 7 + data[i].img);
        break;
    }
  }
  for (let i = 0; i < 4; i++) {
    str = str + Math.floor(Math.random() * 10);
  }
  return str;
};

export default App;
