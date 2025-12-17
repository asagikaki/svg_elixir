defmodule SVG.Error do
  defexception [:type, :detail]

  def message(str),
    do: {:error, str}

  def message(%{type: t, detail: d}),
    do: {:error, "SVG error (#{t}): #{inspect(d)}"}
end
