defmodule SvgTest do
  use ExUnit.Case
  doctest Svg
  doctest SVG.Point
  doctest SVG.Path

  test "greets the world" do
    assert Svg.hello() == :world
  end

  test "creates a new point" do
    testobj =
      SVG.Path.parse_string!("M -10 -10 L 20 20 V -30 L 100,200 Z")
      |> SVG.Path.to_relative()

    # |> SVG.Path.defragment_m()
    # |> SVG.Path.export_as_string()

    assert testobj == "M 10 10 L 20 20 V 0"
  end
end
