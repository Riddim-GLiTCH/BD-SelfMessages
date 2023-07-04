/**
 * @name SelfMessages
 * @author Riddim_GLiTCH
 * @authorId 801089753038061669
 * @version 1.2
 * @description BD theme helper plugin, Marks messages sent by the currently logged in user with an element for use with themes.
 * @invite aYxpgkvdvR
 * @source https://github.com/Riddim-GLiTCH/BD-SelfMessages
 */
class SelfMessages {
  start() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const className = Object.keys(this.injections).find((key) => mutation.target.classList?.contains(key));
          if (className) this.injections[className]([mutation.target]);
        }

        if (mutation.addedNodes.length) this.handleAddedNodes(mutation.addedNodes);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    const currentUserId = this.getCurrentUser()?.id;
    if (!currentUserId) return;

    const messageElements = Array.from(document.querySelectorAll(".message-2CShn3"));
    for (const el of messageElements) {
      if (!el.classList.contains("selfmessage")) {
        const props = this.getReactProps(el, (e) => e.message);
        if (props?.message?.author?.id === currentUserId) el.classList.add("selfmessage");
      }
    }

    console.log("SelfMessages Started");
  }

  stop() {
    this.disconnectObserver();
  }

  handleAddedNodes(addedNodes) {
    for (const node of addedNodes) {
      if (node.nodeType === Node.TEXT_NODE) continue;
      for (const className in this.injections) {
        const elements = node.querySelectorAll(`.${className}`);
        if (elements.length) this.injections[className](elements);
      }
    }
  }

  getReactProps(element, filter) {
    const reactPropsKey = Object.keys(element).find((key) => key.startsWith("__reactProps"));
    const instance = element[reactPropsKey];
    if (!instance) return null;

    const stack = [instance];
    let i = 100;

    while (stack.length && i--) {
      const curr = stack.shift();
      if (!curr) continue;
      if (filter(curr)) return curr;
      if (Array.isArray(curr)) stack.push(...curr);
      else if (curr.children) stack.push(curr.children);
      else if (curr.props) stack.push(curr.props);
    }

    return null;
  }

  getCurrentUser() {
    const module = BdApi.Webpack.getModule((m) => m?._dispatchToken && m.getCurrentUser);
    return module?.getCurrentUser?.();
  }

  disconnectObserver() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  injections = {
    "message-2CShn3": (elements) => {
      for (const el of elements) {
        if (!el.classList?.contains("selfmessage")) {
          const props = this.getReactProps(el, (e) => e.message);
          if (props?.message?.author?.id === this.getCurrentUser()?.id) {
            el.classList.add("selfmessage");
          }
        }
      }
    },
  };
}

module.exports = SelfMessages;
