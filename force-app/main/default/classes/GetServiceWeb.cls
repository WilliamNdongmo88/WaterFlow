public with sharing class GetServiceWeb {
    public String getserviceweb(String end_point) {
        String jsonStr;
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            String endpoint = end_point;
            request.setEndpoint(endpoint);
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            Integer statusCode = response.getStatusCode();
            String responseBody = response.getBody();
            System.debug('###responseBody--->' + responseBody);
            if (response.getStatusCode() == 200) {
                jsonStr = responseBody;
            }
        }
        catch (Exception e) {
            System.debug('Une exception a été levée : ' + e.getMessage());
        }
        return jsonStr;       
    }
}