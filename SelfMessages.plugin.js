/**
 * @name SelfMessages
 * @author Riddim_GLiTCH
 * @authorId 801089753038061669
 * @version 1.0
 * @description BD theme helper plugin, Marks messages sent by the currently logged in user with an element for use with themes.
 * @invite aYxpgkvdvR
 * @source https://github.com/Riddim-GLiTCH/BD-SelfMessages
 */

module.exports = class MyPlugin {
  constructor(meta) {
    // Do stuff in here before starting
  }

  start() {
    // Do stuff when enabled
    if (this._observer) _obs.disconnect();

const currentUserId = BdApi.Webpack.getModule(m => m?._dispatchToken && m.getCurrentUser).getCurrentUser().id;

const getReactProps = (element, filter) => {
    const instance = element[Object.keys(element).find(e => e.startsWith("__reactProps"))];

    if (!instance) return;

    let stack = [instance], i = 100;
    
    while (stack.length && i--) {
        const curr = stack.shift();

        if (!curr) continue;
        if (filter(curr)) return curr;
        
        if (Array.isArray(curr)) stack.push(...curr);
        else if (curr.children) stack.push(curr.children);
        else if (curr.props) stack.push(curr.props);
    }
}

{
    const Injections = {
        "message-2CShn3": elements => {
            for (const el of elements) {
                if (el.classList?.contains("is-current-user")) continue;
                const props = getReactProps(el, e => e.message);
                if (!props || props.message?.author?.id !== currentUserId) continue;
                el.classList.add("is-current-user");
            }
        }
    };

    const obs = this._observer = new MutationObserver(changes => {
        for (const mutation of changes) {
            if (mutation.type === "attributes" && mutation.attributeName === "class") {
               const name = Object.keys(Injections).find(k => mutation.target.classList?.contains(k));
                if (!name) continue;

                Injections[name]([mutation.target]);
            }

            if (!mutation.addedNodes.length) continue;
            
            for (const added of mutation.addedNodes) {
                if (added.nodeType === Node.TEXT_NODE) continue;

                for (const className in Injections) {
                    const elements = Array.from(added.getElementsByClassName(className));

                    if (elements.length) Injections[className](elements);
                }
            }
        }
    });

    obs.observe(document.body, {childList: true, subtree: true, attributes: true});

    
    for (const className in Injections) {
        const elements = Array.from(document.getElementsByClassName(className));
    
        if (!elements.length) continue;
    
        Injections[className](elements)
    }
}
  }

  stop() {
    // Cleanup when disabled
    this._observer.disconnect()
  }
};
