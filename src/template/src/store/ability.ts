export default store => {
  const ability = store.getters.ability;

  ability.update(store.state.rules);

  return store.subscribe(mutation => {
    switch (mutation.type) {
      case "SET_ABILITY":
        ability.update(store.state.rules);
        break;
      case "REMOVE_ABILITY":
        ability.update([]);
        break;
    }
  });
};
