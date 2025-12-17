//※計算上都合が良いので
//終点x,y 第一制御点x1,y1 第二制御点x2,y2で統一している

class Point {
  constructor(type, x, y, x1, y1, x2, y2, rx, ry, angle, laf, sf) {
    this.#set_val(type, x, y, x1, y1, x2, y2, rx, ry, angle, laf, sf);
    this.digit = 8;
  }
  #set_val(type, x, y, x1, y1, x2, y2, rx, ry, angle, laf, sf) {
    this.type = type;
    this.x = this.#setNumber(x);
    this.y = this.#setNumber(y);
    this.x1 = this.#setNumber(x1);
    this.y1 = this.#setNumber(y1);
    this.x2 = this.#setNumber(x2);
    this.y2 = this.#setNumber(y2);

    this.rx = this.#setNumber(rx);
    this.ry = this.#setNumber(ry);
    this.angle = this.#setNumber(angle);
    this.laf = this.#setBool(laf);
    this.sf = this.#setBool(sf);
  }

  #add_val(dx, dy) {
    this.x = this.#addNumber(this.x, dx);
    this.y = this.#addNumber(this.y, dy);
    this.x1 = this.#addNumber(this.x1, dx);
    this.y1 = this.#addNumber(this.y1, dy);
    this.x2 = this.#addNumber(this.x2, dx);
    this.y2 = this.#addNumber(this.y2, dy);
    this.rx = this.#addNumber(this.rx, dx);
    this.ry = this.#addNumber(this.ry, dy);
  }

  static AbsZ() {
    return new Point("Z");
  }
  static RelZ() {
    return new Point("z");
  }

  static AbsM(x, y) {
    return new Point("M", x, y);
  }
  static RelM(x, y) {
    return new Point("m", x, y);
  }
  static AbsL(x, y) {
    return new Point("L", x, y);
  }
  static RelL(x, y) {
    return new Point("l", x, y);
  }
  static AbsV(y) {
    return new Point("V", null, y);
  }
  static RelV(y) {
    return new Point("v", null, y);
  }
  static AbsH(x) {
    return new Point("H", x);
  }
  static RelH(x) {
    return new Point("h", x);
  }

  static AbsQ(x, y, x1, y1) {
    return new Point("Q", x, y, x1, y1);
  }
  static RelQ(x, y, x1, y1) {
    return new Point("q", x, y, x1, y1);
  }
  static AbsT(x, y) {
    return new Point("T", x, y);
  }
  static RelT(x, y) {
    return new Point("t", x, y);
  }
  static AbsC(x, y, x1, y1, x2, y2) {
    return new Point("C", x, y, x1, y1, x2, y2);
  }
  static RelC(x, y, x1, y1, x2, y2) {
    return new Point("c", x, y, x1, y1, x2, y2);
  }
  static AbsS(x, y, x2, y2) {
    return new Point("S", x, y, null, null, x2, y2);
  }
  static RelS(x, y, x2, y2) {
    return new Point("s", x, y, null, null, x2, y2);
  }
  static AbsA(rx, ry, angle, laf, sf, x, y) {
    return new Point("A", x, y, null, null, null, null, rx, ry, angle, laf, sf);
  }
  static RelA(rx, ry, angle, laf, sf, x, y) {
    return new Point("a", x, y, null, null, null, null, rx, ry, angle, laf, sf);
  }

  clone() {
    return new Point(
      this.type,
      this.x,
      this.y,
      this.x1,
      this.y1,
      this.x2,
      this.y2,
      this.rx,
      this.ry,
      this.angle,
      this.laf,
      this.sf,
    );
  }
  #setBool(val) {
    return val != undefined ? Boolean(val) : undefined;
  }
  #addNumber(val0, val1) {
    return val0 != undefined
      ? (val1 != undefined ? Number(val0 + val1) : Number(val0))
      : undefined;
  }
  #setNumber(val) {
    return val != undefined ? Number(val) : undefined;
  }
  roundValue() {
    this.x = this.roundN(this.x);
    this.y = this.roundN(this.y);
    this.x1 = this.roundN(this.x1);
    this.y1 = this.roundN(this.y1);
    this.x2 = this.roundN(this.x2);
    this.y2 = this.roundN(this.y2);
    this.rx = this.roundN(this.rx);
    this.ry = this.roundN(this.ry);
    this.angle = this.roundN(this.angle);
  }

  roundN(val, n) {
    n = n != undefined ? n : this.digit;
    return val != undefined
      ? Math.round(val * (10 ** n)) / (10 ** n)
      : undefined;
  }

  get_border(_prev) {
    /*
      z、Z：null(直前の点の情報での特定が出来ないため)
      m、M：そのまま座標を返す
      h、H：yはprevのy、xはそのまま返す
      v、V：xはprevのx、yはそのまま返す
      l、L：それぞれの座標のうち最小・最大を整理して返す

      Q,q：ベジェ曲線の実際の(x,y)それぞれの最小値・最大値を返す
      T,t：ベジェ曲線の実際の(x,y)それぞれの最小値・最大値を返す(制御点はprevとする)
      C,c：ベジェ曲線の実際の(x,y)それぞれの最小値・最大値を返す
      S,s：ベジェ曲線の実際の(x,y)それぞれの最小値・最大値を返す(制御点はprevとする)

      A,a：楕円弧の実際の(x,y)それぞれの最小値・最大値を返す。
      正直、計算式がかなり難しい。単に楕円だけの最大値・最小値を取った上で実際の描画の最大値・最小値を考慮する……？
      楕円だけの最大値・最小値も中々に厄介
      */
  }

  is_z() {
    return this.type == "z" || this.type == "Z";
  }
  is_relative() {
    return this.type.toLowerCase() == this.type;
  }
  is_absolute() {
    return this.type.toUpperCase() == this.type;
  }
  to_absolute(currentPos) {
    if (this.is_relative) {
      this.type = this.type.toUpperCase();
      this.#add_val(currentPos.x, currentPos.y);
    }
  }
  to_relative(currentPos) {
    if (this.is_absolute) {
      this.type = this.type.toLowerCase();
      this.#add_val(-currentPos.x, -currentPos.y);
    }
  }
  to_String() {
    switch (this.type.toUpperCase()) {
      case "V":
      case "v:":
        return `${this.type}${this.y}`;
      case "H":
        return `${this.type}${this.x}`;
      case "L":
        return `${this.type}${this.x},${this.y}`;
      case "M":
        return `${this.type}${this.x},${this.y}`;
      case "S":
        return `${this.type}${this.x2},${this.y2} ${this.x},${this.y}`;
      case "C":
        return `${this.type}${this.x1},${this.y1} ${this.x2},${this.y2} ${this.x},${this.y}`;
      case "T":
        return `${this.type}${this.x},${this.y}`;
      case "Q":
        return `${this.type}${this.x1},${this.y1} ${this.x},${this.y}`;
      case "A":
        return `${this.type}${this.rx},${this.ry},${this.angle},${
          this.laf ? 1 : 0
        },${this.sf ? 1 : 0},${this.x},${this.y}`;
      case "Z":
        return `${this.type}`;
    }
  }
}

class Path {
  #point_left = 0; //点座標としての最果て
  #point_right = 0;
  #point_bottom = 0;
  #point_top = 0;
  #border_left = 0; //実際のSVGの最果て（曲線の演算がクソダルそう）
  #border_right = 0;
  #border_top = 0;
  #border_bottom = 0;
  constructor(d) { //dはpointsの配列
    this.d = d ?? [];
    /*this.#first_point_abs = new Point("n",0.,0.); //絶対座標としての最初の点
    this.#last_point_abs = new Point("n",0.,0.); //絶対座標としての最後の点*/
    this.#updateBounds();
  }
  clone() {
    const d_array = [];
    this.d.forEach((p) => {
      d_array.push(p.clone());
    });
    return new Path(d_array);
  }
  roundValue() {
    this.d.forEach((p) => {
      p.roundValue();
    });
  }

  getLeft() {
    return this.#point_left;
  }
  getTop() {
    return this.#point_top;
  }
  getBottom() {
    return this.#point_bottom;
  }
  getRight() {
    return this.#point_right;
  }

  static parseString(str) {
    const new_path = new Path();
    const str_proto = str;

    const str_b = str.split(/([ZzAaCcQqSsMmLlHhVv, ])/g).join(" ").split(
      /(?: |,)/g,
    ).filter((x) => ![" ", ""].includes(x));

    str = "";
    //const REGn = /-?\d+(\.\d+)?(e-?\d+)?/g; //数字判定 (\d|\.|e|-)+ -> -?\d+(\.\d+)?(e-?\d+)?
    let precommand = "";
    let i = 0;
    while (i < str_b.length) {
      if ([" ", ""].includes(str_b[i])) {
        i++;
      } else {
        switch (str_b[i]) {
          case "Z":
          case "z":
          case "A":
          case "a":
          case "C":
          case "c":
          case "Q":
          case "q":
          case "S":
          case "s":
          case "M":
          case "m":
          case "L":
          case "l":
          case "H":
          case "h":
          case "T":
          case "t":
          case "V":
          case "v":
            precommand = str_b[i];
            i++;
            break;
          default:
            break;
        }
        switch (precommand) {
          case "Z":
          case "z":
            new_path.d.push(new Point(precommand));
            precommand = "";
            break;
          case "A":
          case "a":
            new_path.d.push(
              new Point(
                precommand,
                str_b[i + 5],
                str_b[i + 6],
                null,
                null,
                null,
                null,
                str_b[i],
                str_b[i + 1],
                str_b[i + 2],
                str_b[i + 3],
                str_b[i + 4],
              ),
            );
            i += 7;
            break;
          case "C":
          case "c":
            new_path.d.push(
              new Point(
                precommand,
                str_b[i + 4],
                str_b[i + 5],
                str_b[i],
                str_b[i + 1],
                str_b[i + 2],
                str_b[i + 3],
              ),
            );
            i += 6;
            break;
          case "Q":
          case "q":
            new_path.d.push(
              new Point(
                precommand,
                str_b[i + 2],
                str_b[i + 3],
                str_b[i],
                str_b[i + 1],
              ),
            );
            i += 4;
            break;
          case "S":
          case "s":
            new_path.d.push(
              new Point(
                precommand,
                str_b[i + 2],
                str_b[i + 3],
                null,
                null,
                str_b[i],
                str_b[i + 1],
              ),
            );
            i += 4;
            break;
          case "M":
          case "m":
          case "L":
          case "l":
            new_path.d.push(new Point(precommand, str_b[i], str_b[i + 1]));
            precommand = ["M", "L"].includes(precommand) ? "L" : "l";
            i += 2;
            break;
          case "H":
          case "h":
            new_path.d.push(new Point(precommand, str_b[i]));
            i += 1;
            break;
          case "V":
          case "v":
            new_path.d.push(new Point(precommand, null, str_b[i]));
            i += 1;
            break;
          default:
            throw Error(`SVG要素にエラーがあります: ${str_proto}`);
        }
      }
    }
    new_path.#updateBounds();
    return new_path;
  }
  defrag_m() {
    let i = 0;
    for (let j = 1; j < this.d.length; j++) {
      if (this.d[i].type == "m" && this.d[j].type == "m") { //連続するmをまとめる
        this.d[i].x += this.d[j].x;
        this.d[i].y += this.d[j].y;
        this.d[j] = new Point("n", 0, 0); //空にする
      } else if (this.d[i].type == "M" && this.d[j].type == "M") { //連続するMをまとめる
        this.d[i].x += this.d[j].x;
        this.d[i].y += this.d[j].y;
        this.d[j] = new Point("n", 0, 0); //空にする
      } else i = j; //連続するm地帯から抜け出したらjを更新する
    }
    this.d = this.d.filter((i) => (i.type != "n"));
  }
  to_String() {
    this.defrag_m();
    const temp = [];
    this.d.forEach((p) => {
      temp.push(p.to_String());
    });
    return temp.join(" ");
  }

  #get_internal(mode, brdr, _concat) { //brdrフラグは左右上下を(再)計算する場合に用いる。_concatは結合処理用(将来用)
    const temp = [];
    let q;
    const currentPos = new Point("n", 0, 0);
    let left = Infinity;
    let top = Infinity;
    let right = -Infinity;
    let bottom = -Infinity;
    const subPos = new Point("n", undefined, undefined);
    //this.#firstPos.x = null; this.#firstPos.y = null;
    for (const p of this.d) {
      /*if (typeof this.firstPos.x != "number" && typeof this.firstPos.y != "number") {
            if (typeof p.x == "number") this.#firstPos.x = p.x;
            if (typeof p.y == "number") this.#firstPos.y = p.y;
          }*/
      if (p.is_z()) {
        q = p.clone();
        currentPos.x = subPos.x;
        currentPos.y = subPos.y;
        subPos.x = undefined;
        subPos.y = undefined;
      } else if (p.is_relative()) {
        q = p.clone();
        if (mode == "abs") q.to_absolute(currentPos);
        if (typeof p.x == "number") currentPos.x += p.x; //currentPosを更新
        if (typeof p.y == "number") currentPos.y += p.y;
        if (p.type == "m") {
          subPos.x = currentPos.x;
          subPos.y = currentPos.y;
        }
      } else if (p.is_absolute()) {
        q = p.clone();
        if (mode == "rel") q.to_relative(currentPos);
        if (typeof p.x == "number") currentPos.x = p.x;
        if (typeof p.y == "number") currentPos.y = p.y;
        if (p.type == "M") {
          subPos.x = currentPos.x;
          subPos.y = currentPos.y;
        }
      }
      if (q == undefined) throw Error();

      temp.push(q);
      if (currentPos.x != null) {
        left = Math.min(left, currentPos.x);
        right = Math.max(right, currentPos.x);
      }
      if (currentPos.y != null) {
        top = Math.min(top, currentPos.y);
        bottom = Math.max(bottom, currentPos.y);
      }
    }

    //this.#lastPos.x = currentPos.x; this.#lastPos.y = currentPos.y;

    if (left == Infinity) left = 0;
    if (top == Infinity) top = 0;
    if (right == -Infinity) right = 0;
    if (bottom == -Infinity) bottom = 0;

    if (brdr) {
      this.#point_left = left;
      this.#point_right = right;
      this.#point_top = top;
      this.#point_bottom = bottom;
    } else this.d = temp;
    return this;
  }

  toAbsoluteAll() {
    return this.#get_internal("abs", false);
  }
  toRelativeAll() {
    return this.#get_internal("rel", false);
  }
  #updateBounds() {
    return this.#get_internal("nop", true);
  }

  static fromPosition(x0, y0) {
    return new Path([Point.AbsM(x0, y0)]);
  }

  static buildSkewer(x, width0, width1, y0, y1) {
    if (width0 < 0 || width1 < 0 || y1 < y0) return new Path();
    const x0 = x - width0 / 2;
    const x1 = x - width1 / 2;
    const x2 = x + width1 / 2;
    const x3 = x + width0 / 2;
    return new Path([
      Point.AbsM(x0, y0),
      Point.AbsL(x1, y1),
      Point.AbsH(x2),
      Point.AbsL(x3, y0),
      Point.AbsZ(),
      Point.AbsM(x, y0),
    ]);
  }
  static buildRectangle(x, width, y0, y1) {
    if (width < 0 || y1 < y0) return new Path();
    const x0 = x - width / 2;
    const x1 = x + width / 2;
    return new Path([
      Point.AbsM(x0, y0),
      Point.AbsV(y1),
      Point.AbsH(x1),
      Point.AbsV(y0),
      Point.AbsZ(),
      Point.AbsM(x, y0),
    ]);
  }

  rescale(s_) { //※今の仕様だと全部Relativeとして帰ります
    this.toAbsoluteAll();
    for (const i of this.d) {
      if (i.x != undefined) i.x *= s_;
      if (i.y != undefined) i.y *= s_;
      if (i.x1 != undefined) i.x1 *= s_;
      if (i.y1 != undefined) i.y1 *= s_;
      if (i.x2 != undefined) i.x2 *= s_;
      if (i.y2 != undefined) i.y2 *= s_;
      if (i.rx != undefined) i.rx *= s_;
      if (i.ry != undefined) i.ry *= s_;
    }
    return this.toRelativeAll();
  }

  concat(path) {
    this.d = this.d.concat(path.d);
    this.#updateBounds();
    return this;
  }
  append_point_list(point_list) {
    this.d = this.d.concat(point_list);
    this.#updateBounds();
    return this;
  }
  append_point(point) {
    this.d.push(point);
    this.#updateBounds();
    return this;
  }
  setDrawPosition(x0, y0) {
    this.d.unshift(Point.AbsM(x0, y0));
    this.#updateBounds();
    return this;
  }

  //merge系が上手くいってなかった（過去形）

  mergePath2(path0, x0, y0) {
    return this.append_point_list([Point.AbsM(x0, y0)].concat(path0.d));
  }
  mergePath3(path0, path1, x0, y0, x1, y1) {
    const points = [Point.AbsM(x0, y0)].concat(
      path0.d,
      [Point.AbsM(x1, y1)],
      path1.d,
    );
    return this.append_point_list(points);
  }
}

class SVG {
}
export { Path, Point, SVG };
