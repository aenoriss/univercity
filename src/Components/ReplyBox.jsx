import { useEffect, useState, useRef } from "react";

export default function ReplyBox({ selectedReverie }) {
  useEffect(() => {
    // console.log("textureasdasdasd", texture);
  }, []);

  return (
    <>
      <div className="reverie_reply_list">
        <div>
          <div className="addButton">
            <div>+</div>
          </div>
        </div>

        <div>
          {selectedReverie &&
            selectedReverie["replies"].map((reply) => {
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
              console.log("postDate", postDate);
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
    </>
  );
}
