import { useEffect, useState, useRef } from "react";
import { DBAddReply, DBRetrieveRevReplies,closeListener} from "../Utils/firebase";

export default function ReplyBox({ selectedReverie }) {
  const [reply, setReply] = useState();
  const [replyObj, setReplyObj] = useState([]);
  const [replyArr, setReplyArr] = useState([]);

  useEffect(()=> {
     //component unmounted
     return () => {
      closeListener(`posts/${selectedReverie["id"]}/replies`)
    };
  },[])


  useEffect(() => {
    DBRetrieveRevReplies(selectedReverie["id"], setReplyObj);
  }, [selectedReverie]);

  useEffect(() => {
    if (replyObj && Object.keys(replyObj).length > 0) {
      let arrReplyList = [];
      for (const key in replyObj) {
        arrReplyList.push(replyObj[key]);
      }
      setReplyArr(arrReplyList);
    }
  }, [replyObj]);
  

  const replyHandler = (e) => {
    setReply(e.target.value);
  };

  useEffect(() => {
    let replyBox = document.getElementById("containerScroll")
    replyBox.scrollTo(0, replyBox.scrollHeight);
  }, [replyArr]);

  const replySubmitHandler = () => {
    console.log("replyText", reply);
    DBAddReply(selectedReverie.id, { text: reply, date: Date.now() });
    setReply("");
  };

  return (
    <div className="replyContainer">
      <div id="containerScroll" className="reverie_reply_list">
        <div>
          {selectedReverie &&
            replyArr.map((reply) => {
              let postDate = {
                time:
                  new Date(reply.date).getHours().toString() +
                  ":" +
                  new Date(reply.date).getMinutes().toString() +
                  ":" +
                  new Date(reply.date).getSeconds().toString(),
                day:
                  (new Date(reply.date).getMonth() + 1).toString() +
                  "/" +
                  new Date(reply.date).getDate().toString() +
                  "/" +
                  new Date(reply.date).getFullYear().toString(),
              };
              // console.log("postDate", postDate);
              return (
                <div className="reverie_reply_item">
                  <div className="reverie_reply_item_img">
                    <img src="sideworld_logo.jpg" width="60px" />
                  </div>
                  <div className="reverie_reply_item_content">
                    <div>{`${reply.text}`}</div>
                    <div className="reverie_info_panel_content_title">{`${postDate.time} - ${postDate.day}`}</div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="replyInputContainer">
        <input
          type="text"
          className="replyInput"
          placeholder="Share yout toughts!"
          value={reply}
          onChange={replyHandler}
        />
        <div className="addButton" onClick={replySubmitHandler}>
          <div>+</div>
        </div>
      </div>
    </div>
  );
}
