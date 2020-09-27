import Reconciler from 'react-reconciler';

function shallowDiff(oldProps, newProps) {
  const uniqueProps = new Set([
    ...Object.keys(oldProps),
    ...Object.keys(newProps),
  ]);
  const changedProps = Array.from(uniqueProps).filter(
    (propName) => oldProps[propName] !== newProps[propName]
  );

  return changedProps;
}

function setStyles(domElement, styles) {
  Object.keys(styles).forEach((name) => {
    const rawValue = styles[name];
    const isEmpty =
      rawValue === null || typeof rawValue === 'boolean' || rawValue === '';

    if (isEmpty) domElement.style[name] = '';
    else {
      const value = typeof rawValue === 'number' ? `${rawValue}px` : rawValue;

      domElement.style[name] = value;
    }
  });
}

const hostConfig = {
  supportsMutation: true,

  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    const el = document.createElement(type);
    ['alt', 'className', 'href', 'rel', 'src', 'target'].forEach((k) => {
      if (props[k]) el[k] = props[k];
    });

    if (props.onClick) {
      el.addEventListener('click', props.onClick);
    }

    return el;
  },
  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    return document.createTextNode(text);
  },

  appendChildToContainer(container, child) {
    container.appendChild(child);
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  appendInitialChild(parent, child) {
    parent.appendChild(child);
  },

  removeChildFromContainer(container, child) {
    container.removeChild(child);
  },
  removeChild(parent, child) {
    parent.removeChild(child);
  },
  insertInContainerBefore(container, child, before) {
    container.insertBefore(child, before);
  },
  insertBefore(parent, child, before) {
    parent.insertBefore(child, before);
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    currentHostContext
  ) {
    return shallowDiff(oldProps, newProps);
  },
  commitUpdate(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    finishedWork
  ) {
    updatePayload.forEach((propName) => {
      // eslint-disable-next-line default-case
      switch (propName) {
        case 'style': {
          const styleDiffs = shallowDiff(oldProps.style, newProps.style);
          const finalStyles = styleDiffs.reduce((acc, styleName) => {
            // Style marked to be unset
            if (!newProps.style[styleName]) acc[styleName] = '';
            else acc[styleName] = newProps.style[styleName];

            return acc;
          }, {});

          setStyles(instance, finalStyles);
        }
      }
    });
  },

  commitMount(instance, type, newProps, internalInstanceHandle) {},

  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.nodeValue = newText;
  },

  finalizeInitialChildren(...rest) {
    console.log(rest);
  },
  getChildHostContext() {},
  getPublicInstance() {},
  getRootHostContext() {},
  prepareForCommit() {},
  resetAfterCommit() {},
  shouldSetTextContent() {
    return false;
  },
};

const ReactMiniDOMRenderer = Reconciler(hostConfig);

export default {
  render(element, domContainer, callback) {
    const container = ReactMiniDOMRenderer.createContainer(
      domContainer,
      false,
      false
    );
    ReactMiniDOMRenderer.updateContainer(element, container, null, null);
  },
};
