const storage = {
  save(name, data) {
    return localStorage.setItem(name, data);
  },
  load(name, data) {
    return localStorage.getItem(name, data);
  },
  remove(name, data) {
    return localStorage.removeItem(name, data);
  }
};

export default storage;