# (open) Issues

In this document I want to collect the (open) issues, so I can track them ...

## refactor userSlice.ts

I didn't refactor, because I was not able to figure out the type for the `GetThunkAPI<AsyncThunkConfig>`.

## CustomFormSelect background color

I didn'T figure out, how to set the background color for the input line of the Custom Form Select. I was only able to set the background color for the open options.

## vertical Scrollbar in the dashboard

There is a vertical scrollbar (not always, but for the most time). I think it is because the <Toaster> occupies a little bit of vertical space. I was not able to prevent this (without using `overflow-y-hidden` - which I don't want to do, because in this case it would be also hidden if it is needed).
