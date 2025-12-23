class SeedRandom {
  constructor(seed) {
    this.seed = seed || 12345;
  }

  // Simple Linear Congruential Generator
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  // Range [min, max]
  range(min, max) {
    return Math.floor(this.next() * (max - min + 1) + min);
  }

  // Pick random item from array
  pick(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[this.range(0, arr.length - 1)];
  }

  // Shuffle array (Fisher-Yates)
  shuffle(arr) {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = this.range(0, i);
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  }
}

module.exports = SeedRandom;
