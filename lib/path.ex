defmodule SVG.Path do
  alias SVG.Point, as: Point

  @moduledoc """
  Documentation for `SVG.Path`.
  """
  # List of %Point{}
  defstruct points: []

  def new(points) when is_list(points) do
    %SVG.Path{points: points}
  end

  def round_values(%SVG.Path{points: points}, decimal_places)
      when is_integer(decimal_places) and decimal_places >= 0 do
    rounded_points = Enum.map(points, fn point -> Point.round_values(point, decimal_places) end)
    %SVG.Path{points: rounded_points}
  end

  def parse_string!(string) when is_binary(string) do
    case parse_string(string) do
      {:ok, path} -> path
      {:error, e} -> raise(e)
    end
  end

  # string -> path
  def parse_string(string) when is_binary(string) do
    array_point = []

    str_b =
      String.split(string, ~r/([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)/,
        include_captures: true
      )

      # 数字基準で分割する
      # 一旦スペースでくっつける
      |> Enum.join(" ")
      # 空白とコンマを削除する
      |> String.split(~r/(?: |,)/)
      # 空データも削除する
      |> Enum.filter(fn x -> x not in [" ", ""] end)

    try do
      points =
        Enum.map(str_b, &to_token(&1))
        |> to_point()

      {:ok, %SVG.Path{points: points}}
    catch
      e -> SVG.Error.message(e)
    end
  end

  defp to_token(value) do
    case Float.parse(value) do
      {num, _} ->
        num

      _ ->
        v = String.to_atom(value)
        if Point.is_legal_command?(v), do: v, else: throw("Invalid Value found: #{value}")
    end
  end

  defp to_point([], _prev), do: []
  defp to_point([]), do: []

  defp to_point(list, prev \\ :None) do
    [head | tail] = list

    case head do
      h when h in [:t, :T, :l, :L] ->
        [val_0, val_1 | rest] = tail
        [%Point{command: head, x: val_0, y: val_1} | to_point(rest, head)]

      :m ->
        [val_0, val_1 | rest] = tail
        [%Point{command: head, x: val_0, y: val_1} | to_point(rest, :l)]

      :M ->
        [val_0, val_1 | rest] = tail
        [%Point{command: head, x: val_0, y: val_1} | to_point(rest, :L)]

      h when h in [:z, :Z] ->
        [%Point{command: head} | to_point(tail, :None)]

      h when h in [:v, :V] ->
        [val_0 | rest] = tail
        [%Point{command: head, y: val_0} | to_point(rest, head)]

      h when h in [:h, :H] ->
        [val_0 | rest] = tail
        [%Point{command: head, x: val_0} | to_point(rest, head)]

      h when h in [:s, :S] ->
        [val_0, val_1, val_2, val_3 | rest] = tail
        [%Point{command: head, x: val_2, y: val_3, x2: val_0, y2: val_1} | to_point(rest, head)]

      h when h in [:q, :Q] ->
        [val_0, val_1, val_2, val_3 | rest] = tail
        [%Point{command: head, x: val_2, y: val_3, x1: val_0, y1: val_1} | to_point(rest, head)]

      h when h in [:c, :C] ->
        [val_0, val_1, val_2, val_3, val_4, val_5 | rest] = tail

        [
          %Point{command: head, x: val_4, y: val_5, x1: val_0, y1: val_1, x2: val_2, y2: val_3}
          | to_point(rest, head)
        ]

      h when h in [:a, :A] ->
        [val_0, val_1, val_2, val_3, val_4, val_5, val_6 | rest] = tail

        [
          %Point{
            command: head,
            x: val_5,
            y: val_6,
            rx: val_0,
            ry: val_1,
            angle: val_2,
            laf: val_3,
            sf: val_4
          }
          | to_point(rest, head)
        ]

      _ ->
        if prev != :None and is_number(head),
          do: to_point([prev | list], :None),
          else: throw("Invalid command found: #{head}")
    end
  end

  def export_as_string!(arg) do
    case export_as_string(arg) do
      {:ok, str} -> str
      {:error, msg} -> raise msg
    end
  end

  # path -> string
  def export_as_string(%SVG.Path{points: points}) do
    try do
      {:ok,
       Enum.map(points, &Point.export_as_string!(&1))
       |> Enum.join(" ")}
    catch
      e -> {:error, e}
    end
  end

  def export_as_string(obj), do: SVG.Error.message("Invalid object found: #{obj}")

  # 重複mの処理
  def defragment_m(%SVG.Path{points: points}) do
    points
    |> Enum.reduce([], fn point, acc ->
      case acc do
        [%{command: c, x: x, y: y} = _prev | rest]
        when c == point.command and c in [:m, :M] ->
          # 連続する m / M を合算
          [Point.add_position(point, x, y) | rest]

        _ ->
          [point | acc]
      end
    end)
    |> Enum.reverse()
    |> new()
  end

  def to_relative(%SVG.Path{} = path), do: gather_sub(path, :rel)
  def to_absolute(%SVG.Path{} = path), do: gather_sub(path, :abs)
  def get_border(%SVG.Path{} = path), do: gather_sub(path, :border)

  defp gather_sub(%SVG.Path{points: points}, mode),
    do:
      gather_sub(
        points,
        mode,
        %{left: :inf, top: :inf, right: :neg_inf, bottom: :neg_inf},
        %{x: 0.0, y: 0.0},
        %{x: nil, y: nil}
      )

  defp gather_sub([], :border, %{left: l, top: t, right: r, bottom: b}, _, _),
    do: %{
      left: normalize_float(l),
      top: normalize_float(t),
      right: normalize_float(r),
      bottom: normalize_float(b)
    }

  defp gather_sub([], :abs, _, _, _), do: []
  defp gather_sub([], :rel, _, _, _), do: []

  defp gather_sub(
         points,
         mode,
         %{left: _l, top: _t, right: _r, bottom: _b} = border,
         %{x: x0, y: y0} = _current_pos,
         %{x: x1, y: y1} = _subpath_start_pos
       ) do
    [head | rest] = points

    case head.command do
      c when c in [:z, :Z] ->
        current_pos = %{x: x1, y: y1}
        subpath_start_pos = %{x: nil, y: nil}

        cond do
          mode == :border ->
            gather_sub(rest, mode, border, current_pos, subpath_start_pos)

          mode == :abs ->
            [
              Point.to_absolute!(head, x0, y0)
              | gather_sub(rest, mode, border, current_pos, subpath_start_pos)
            ]

          mode == :rel ->
            [
              Point.to_relative!(head, x0, y0)
              | gather_sub(rest, mode, border, current_pos, subpath_start_pos)
            ]
        end

      _ ->
        x0_ = calc_next_coord(head.command, x0, head.x)
        y0_ = calc_next_coord(head.command, y0, head.y)
        current_pos = %{x: x0_, y: y0_}

        subpath_start_pos =
          if head.command in [:m, :M], do: %{x: x0_, y: y0_}, else: %{x: x1, y: y1}

        border = comp(border, current_pos)

        cond do
          mode == :border ->
            gather_sub(rest, mode, border, current_pos, subpath_start_pos)

          mode == :abs ->
            [
              Point.to_absolute!(head, x0, y0)
              | gather_sub(rest, mode, border, current_pos, subpath_start_pos)
            ]

          mode == :rel ->
            [
              Point.to_relative!(head, x0, y0)
              | gather_sub(rest, mode, border, current_pos, subpath_start_pos)
            ]
        end
    end
  end

  defp calc_next_coord(command, curr, next),
    do: if(Point.is_relative_command?(command), do: add(curr, next), else: next || curr)

  defp add(nil, d), do: d
  defp add(v, nil), do: v
  defp add(v, d), do: v + d

  defp normalize_float(:neg_inf), do: 0.0
  defp normalize_float(:inf), do: 0.0
  defp normalize_float(f), do: f

  defp comp(%{left: l, top: t, right: r, bottom: b}, %{x: x, y: y}) do
    %{left: _min(l, x), top: _min(t, y), right: _max(r, x), bottom: _max(b, y)}
  end

  defp _max(:neg_inf, b), do: b
  defp _max(a, :neg_inf), do: a
  defp _max(a, b), do: max(a, b)

  defp _min(:inf, b), do: b
  defp _min(a, :inf), do: a
  defp _min(a, b), do: min(a, b)
end
