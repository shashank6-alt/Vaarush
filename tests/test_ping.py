def test_ping(app_client):
    result = app_client.call("ping")
    assert result == "pong"
