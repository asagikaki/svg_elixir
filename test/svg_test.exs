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
      SVG.Path.parse_string!("M -10 -10 L 20 20 v -30 L 100,200 Z")
      |> SVG.Path.extract_abs_or_rel()

    # |> SVG.Path.to_relative()
    # |> SVG.Path.export_as_string_mass!()

    # |> SVG.Path.defragment_m()
    # |> SVG.Path.export_as_string()

    assert testobj == "m -10.0,-10.0 l 30.0,30.0 v -50.0 l 80.0,230.0 z"
  end
end
