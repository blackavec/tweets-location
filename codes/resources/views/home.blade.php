<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Tweets Location</title>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="/css/bootstrap.min.css">

    <!-- Optional theme -->
    <link rel="stylesheet" href="/css/bootstrap-theme.min.css">

    <script src="/js/react.js"></script>
</head>
<body>
    <div id="container"></div>
    <script>
        window.googleApiKey = '{!! env('GOOGLE_MAP_API_KEY') !!}';
    </script>
    <script src="/js/built/index.js"></script>
</body>
</html>