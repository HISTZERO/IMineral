export class SequenceModel {
  private value: number;
  private reverse: boolean;
  SequenceModel() {
    this.value = 0;
  }

  setDefaultValue(value: number) {
    this.value = value;
  }

  setReverse(reverse: boolean) {
    this.reverse = reverse;
  }
  getNextVal(): number {
    const result = this.value;

    if (this.reverse) {
      this.value--;
    } else {
      this.value++;
    }

    return (result);
  }
}
