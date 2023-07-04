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
    const currentUserId = () => {return this.getCurrentUser()?.id};
    if (!currentUserId()) return;

    const messageElements = Array.from(document.querySelectorAll(".message-2CShn3"));
    for (const el of messageElements) {
      if (!el.classList.contains("selfmessage")) {
        const props = this.getReactProps(el, (e) => e.message);
        if (props?.message?.author?.id === currentUserId()) el.classList.add("selfmessage");
      }
    }

    console.log("SelfMessages Started");
  }

  stop() {
    const messageElements = document.querySelectorAll(".selfmessage");
    
    for (const el of messageElements) {
      if (el.classList.contains("selfmessage")) {
        el.classList.remove("selfmessage");
      }
    }
    
    console.log("SelfMessages Stopped");
  }
  

  observer({addedNodes}) {
    for (const added of addedNodes) {
      if (added.nodeType === Node.TEXT_NODE) continue;
      
      const messageElements = Array.from(added.querySelectorAll(".message-2CShn3"));
      const currentUserId = () => {return this.getCurrentUser()?.id};
      if (!currentUserId()) return;
      
      for (const el of messageElements) {
        if (!el.classList.contains("selfmessage")) {
          const props = this.getReactProps(el, (e) => e.message);
          if (props?.message?.author?.id === currentUserId) {
            el.classList.add("selfmessage");
          }
        }
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
}

module.exports = SelfMessages;
