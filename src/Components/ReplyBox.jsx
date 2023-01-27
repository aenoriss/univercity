import { useEffect, useState, useRef } from "react";


export default function ReplyBox({ selectedReverie }) {

  console.log("selectedReverie", selectedReverie)

  return (
    <>
      <h1>Conversation</h1>
      {selectedReverie && selectedReverie["replies"].map((reply)=> {
        return (
          <div className="reverie_reply_list">
            <p className="reverie_reply_item">{reply.text}</p>
            <div className="reverie_reply_item">{reply.date}</div>
          </div>
        )
      })}
    </>
  );
}
