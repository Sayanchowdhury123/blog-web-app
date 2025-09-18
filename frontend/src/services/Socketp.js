import * as Y from "yjs";
import { io } from "socket.io-client";
import { Awareness } from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";

export class CustomSocketIOProvider {
  constructor(serverUrl, roomName, doc, opts = {}) {
    this.doc = doc;
    this.roomName = roomName;
    this.awareness = new Awareness(doc);

    // connect to socket.io server
    this.socket = io(serverUrl, {
      auth: opts.auth || {},
      query: { room: roomName },
    });

    // when connected, sync state
    this.socket.on("connect", () => {
      console.log("Connected to room:", roomName);
      const encoder = encoding.createEncoder();
      syncProtocol.writeSyncStep1(encoder, doc);
      this.socket.emit("sync", encoding.toUint8Array(encoder));
    });

    // sync messages
    this.socket.on("sync-step", (msg) => {
      const decoder = decoding.createDecoder(new Uint8Array(msg));
      const encoder = encoding.createEncoder();
      syncProtocol.readSyncMessage(decoder, encoder, doc, this);
      if (encoding.length(encoder) > 0) {
        this.socket.emit("sync-step", encoding.toUint8Array(encoder));
      }
    });

    // awareness updates
    this.awareness.on("update", ({ added, updated, removed }) => {
      const changedClients = added.concat(updated, removed);
      const encoder = encoding.createEncoder();
      awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        changedClients,
        encoder
      );
      this.socket.emit("awareness", encoding.toUint8Array(encoder));
    });

    this.socket.on("awareness", (msg) => {
      awarenessProtocol.applyAwarenessUpdate(
        this.awareness,
        new Uint8Array(msg),
        this
      );
    });
  }

  destroy() {
    this.socket.disconnect();
    this.awareness.destroy();
  }
}
