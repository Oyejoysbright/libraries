package com.tawol.tims.utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfWriter;

import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.multipart.MultipartFile;

// import uk.me.jstott.jcoord.LatLng;
// import uk.me.jstott.jcoord.OSRef;

public class Jpc {

    public class JFile {

        public String save (MultipartFile file, String path) {
            String attachment = "";
            try {
                if (file != null) {
                    if(new Jpc().new JFile().createDirectory(path)) {
                        attachment = path + new Jpc().new JContent().new Randoms().string(100)
                        + file.getOriginalFilename();
                        try (FileOutputStream outputStream = new FileOutputStream(attachment)) {
                            outputStream.write(file.getBytes());
                            outputStream.close();
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return attachment;
        }
        public void write (String filePath, String content){
            try {
                FileWriter writer = new FileWriter(filePath);
                writer.write(content);
                writer.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        public void create (String filePath) {
            try {
                File file = new File(filePath);
                file.createNewFile();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        public Boolean createDirectory (String path) {
            try {
                File directory = new File(path);
                if (!directory.exists()) {
                    directory.mkdirs();
                } 
                return true;
            } catch (Exception e) {
                throw e;
            }
        }
        public class converter {
            public File multipartToFile (MultipartFile mFile, String fileName) {
                File convert = new File(System.getProperty("java.io.tmpdir")+"/"+fileName);
                try {
                    mFile.transferTo(convert);
                } catch (IllegalStateException | IOException e) {
                    e.printStackTrace();
                }
                return convert;
            }
        }
        public List<Object> importCsv(Object object, File file) throws FileNotFoundException {
            List<Object> res = new ArrayList<>();
            // FileReader read = new FileReader(file);
            return res;
        }

        public class CSV {

        }

        public class Excel {
            List<JSONObject> processSheet(XSSFSheet sheet) {
                List<JSONObject> result = new ArrayList<>();
                result.add(new JSONObject().put("sheet", sheet.getSheetName()));
                List<String> keys = new ArrayList<>();

                for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {
                    XSSFRow row = sheet.getRow(i);

                    JContent.JSON json = new JContent().new JSON();
                    JSONObject temp = json.status(null, null, null);
                    int limit = 0;
                    if (keys.isEmpty()) {
                        limit = row.getPhysicalNumberOfCells();
                    } else {
                        limit = keys.size();
                    }

                    for (int j = 0; j < limit; j++) {
                        if (i == 0) {
                            try {
                                keys.add(row.getCell(j).getStringCellValue());                                
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        } else {
                            try {
                                temp.put(keys.get(j), row.getCell(j).getStringCellValue());
                            } catch (Exception e) {
                                try {
                                    temp.put(keys.get(j), (int) row.getCell(j).getNumericCellValue());
                                } catch (Exception ex) {
                                    temp.put(keys.get(j), "");
                                }
                            }
                        }
                    }

                    if (i != 0) {
                        result.add(temp);
                    }

                }
                return result;
            }

            public List<List<JSONObject>> Import(MultipartFile file, List<Integer> sheets) throws IOException {
                XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
                List<List<JSONObject>> res = new ArrayList<>();
                if (sheets == null) {
                    for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                        // res.add(Arrays.asList(new JSONObject().put("sheet", workbook.getSheetName(i))));
                        res.add(processSheet(workbook.getSheetAt(i)));
                    }

                } else {
                    for (int i : sheets) {
                        try {
                            // res.add(Arrays.asList(new JSONObject().put("sheet", workbook.getSheetName(i))));
                            res.add(processSheet(workbook.getSheetAt(i)));
                        } catch (Exception e) {
                        }
                    }
                }
                workbook.close();
                return res;
            }
        }

    }

    public class JArray {

        public class find {

            public class getValue {

                public Integer integer(Integer searchValue, List<Integer> searchArray) {
                    for (Integer val : searchArray) {
                        if (val == searchValue) {
                            return searchValue;
                        }
                    }
                    return 0;
                }

            }

            public class getBoolean {

                public Boolean integer(Integer searchValue, List<Integer> searchArray) {
                    for (Integer val : searchArray) {
                        if (val == searchValue) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        }
    }

    public class JContent {

        public double convertDurationToNumber(String duration) {
            String[] part = duration.split("(?<=\\D)(?=\\d)|(?<=\\d)(?=\\D)");
            return Double.parseDouble(part[0]);
        }

        public class Spread {
            public String STRING (List<Integer> arg, String... arg2) {
                String res = "";
                for (int i = 0; i < arg2.length; i++) {
                    if(!arg.contains(i)) {
                        res += arg2[0];
                    }
                }
                return res;
            }
        }
        public class Randoms {
            public String string(int length) {
                String chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWSYZabcdefghijklmnopqrstuvwxyz";
                String res = "";
                for (int i = 0; i < length; i++) {
                    int pos = (int) Math.floor(Math.random() * chars.length());
                    res += chars.substring(pos, pos+1);
                }
                return res;
            }
        }
        public class containsIgnoreCase {
            public Optional<String> getString(List<String> arg0, String arg1) {
                Optional<String> res = Optional.empty();
                for (String string : arg0) {
                    if (string.equalsIgnoreCase(arg1)) {
                        return res = Optional.of(string);
                    }
                }
                return res;
            }

            public Optional<Integer> getIndex(List<String> arg0, String arg1) {
                Optional<Integer> res = Optional.of(-1);
                for (String string : arg0) {
                    if (string.equalsIgnoreCase(arg1)) {
                        return res = Optional.of(arg0.indexOf(string));
                    }
                }
                return res;
            }
        }
        public List<String> figures() {
            return Arrays.asList("0","1","2","3","4","5","6","7","8","9");
        }
        public String extractInt (String arg) {
            String res = "";
            for (int i = 0; i < arg.length(); i++) {
                if (figures().contains(String.valueOf(arg.charAt(i)))) {
                    res += arg.charAt(i);
                }
            }
            return res;
        }
        public class JSON {
            public JSONObject status(Boolean status, Object message, String description) {
                JSONObject json = new JSONObject();
                if (status != null) {
                    json.put("status", status);
                }
                if (message != null) {
                    json.put("message", message);
                }
                if (description != null) {
                    json.put("description", description);
                }
                return json;
            }

            public JSONObject status(Boolean status, Object message, String description, Object existing) {
                JSONObject json = new JSONObject();
                try {
                    if (status != null) {
                        json.put("status", status);
                    }
                    if (message != null) {
                        json.put("message", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(message));
                    }
                    if (description != null) {
                        json.put("description", description);
                    }
                    if(existing != null) {
                        json.put("existingData", new ObjectMapper().writerWithDefaultPrettyPrinter().writeValueAsString(existing));
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return json;
            }

            public List<String> arrayToListString(JSONArray array) {
                List<String> res = new ArrayList<>();
                if (array != null) {
                    for (int i = 0; i < array.length(); i++) {
                        res.add(array.getString(i));
                    }
                }
                return res;
            }
        }
    }

    public class JArrayObject {

    }

    public class JObject {
        public String writeAsString(Object object, List<Object> objectList) throws JsonProcessingException {
            ObjectMapper mapper = new ObjectMapper();
            String response = "";
            if (object != null && objectList == null) {
                response = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(object);
            } else if(objectList != null && object == null) {
                response = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(objectList);
            }
            return response;
        }
        
    }

    public enum Conjunction {
        OR, AND;
    }

    public class JMailing {
        public void send() {
            
        }
    }

    public class JGps {
        public class GpsType {
            public String EastingNorthing(){ return "EN";};
            public String LatLong() {return "LL";};
        }

        public Double[]  ConvertGeo(String baseType, String resultType, Double loc1, Double loc2) {
            switch (baseType) {
                case "EN": 
                    switch (resultType) {
                        case "LL": return ENtoLL(loc1, loc2);
                        default: return null;
                    }
                case "LL": 
                switch (resultType) {
                    case "EN": return LLtoEN(loc1, loc2);
                    default: return null;
                }
                default: return null;
            }
        }

        // public Double[] ENtoLL(double loc1, double loc2) {
        //     Double res[] = new Double[2];
        //     OSRef osRef = new OSRef(loc1, loc2);
        //     LatLng latLng = osRef.toLatLng();
        //     res[0] = latLng.getLatitude(); res[1] = latLng.getLongitude();
        //     return res;
        // }
        // public Double[] LLtoEN(double loc1, double loc2) {
        //     Double res[] = new Double[2];
        //     LatLng latLng = new LatLng(loc1, loc2);
        //     OSRef osRef = new OSRef(latLng);
        //     res[0] = osRef.getEasting();
        //     res[1] = osRef.getNorthing();
        //     return res;
        // }

        public class Deg2UTM {
            double Easting;
            double Northing;
            int Zone;
            char Letter;

            public Deg2UTM(double Lat,double Lon) {
                Zone = (int) Math.floor(Lon/6+31);
                if (Lat<-72) 
                    Letter='C';
                else if (Lat<-64) 
                    Letter='D';
                else if (Lat<-56)
                    Letter='E';
                else if (Lat<-48)
                    Letter='F';
                else if (Lat<-40)
                    Letter='G';
                else if (Lat<-32)
                    Letter='H';
                else if (Lat<-24)
                    Letter='J';
                else if (Lat<-16)
                    Letter='K';
                else if (Lat<-8) 
                    Letter='L';
                else if (Lat<0)
                    Letter='M';
                else if (Lat<8)  
                    Letter='N';
                else if (Lat<16) 
                    Letter='P';
                else if (Lat<24) 
                    Letter='Q';
                else if (Lat<32) 
                    Letter='R';
                else if (Lat<40) 
                    Letter='S';
                else if (Lat<48) 
                    Letter='T';
                else if (Lat<56) 
                    Letter='U';
                else if (Lat<64) 
                    Letter='V';
                else if (Lat<72) 
                    Letter='W';
                else
                    Letter='X';
                Easting=0.5*Math.log((1+Math.cos(Lat*Math.PI/180)*Math.sin(Lon*Math.PI/180-(6*Zone-183)*Math.PI/180))/(1-Math.cos(Lat*Math.PI/180)*Math.sin(Lon*Math.PI/180-(6*Zone-183)*Math.PI/180)))*0.9996*6399593.62/Math.pow((1+Math.pow(0.0820944379, 2)*Math.pow(Math.cos(Lat*Math.PI/180), 2)), 0.5)*(1+ Math.pow(0.0820944379,2)/2*Math.pow((0.5*Math.log((1+Math.cos(Lat*Math.PI/180)*Math.sin(Lon*Math.PI/180-(6*Zone-183)*Math.PI/180))/(1-Math.cos(Lat*Math.PI/180)*Math.sin(Lon*Math.PI/180-(6*Zone-183)*Math.PI/180)))),2)*Math.pow(Math.cos(Lat*Math.PI/180),2)/3)+500000;
                Easting=Math.round(Easting*100)*0.01;
                Northing = (Math.atan(Math.tan(Lat*Math.PI/180)/Math.cos((Lon*Math.PI/180-(6*Zone -183)*Math.PI/180)))-Lat*Math.PI/180)*0.9996*6399593.625/Math.sqrt(1+0.006739496742*Math.pow(Math.cos(Lat*Math.PI/180),2))*(1+0.006739496742/2*Math.pow(0.5*Math.log((1+Math.cos(Lat*Math.PI/180)*Math.sin((Lon*Math.PI/180-(6*Zone -183)*Math.PI/180)))/(1-Math.cos(Lat*Math.PI/180)*Math.sin((Lon*Math.PI/180-(6*Zone -183)*Math.PI/180)))),2)*Math.pow(Math.cos(Lat*Math.PI/180),2))+0.9996*6399593.625*(Lat*Math.PI/180-0.005054622556*(Lat*Math.PI/180+Math.sin(2*Lat*Math.PI/180)/2)+4.258201531e-05*(3*(Lat*Math.PI/180+Math.sin(2*Lat*Math.PI/180)/2)+Math.sin(2*Lat*Math.PI/180)*Math.pow(Math.cos(Lat*Math.PI/180),2))/4-1.674057895e-07*(5*(3*(Lat*Math.PI/180+Math.sin(2*Lat*Math.PI/180)/2)+Math.sin(2*Lat*Math.PI/180)*Math.pow(Math.cos(Lat*Math.PI/180),2))/4+Math.sin(2*Lat*Math.PI/180)*Math.pow(Math.cos(Lat*Math.PI/180),2)*Math.pow(Math.cos(Lat*Math.PI/180),2))/3);
                if (Letter<='M')
                    Northing = Northing + 10000000;
                Northing=Math.round(Northing*100)*0.01;
            }
        }
        
        public class UTM2Deg {
            double latitude;
            double longitude;

            public UTM2Deg(String UTM){
                String[] parts=UTM.split(" ");
                int Zone=Integer.parseInt(parts[0]);
                char Letter=parts[1].toUpperCase(Locale.ENGLISH).charAt(0);
                double Easting=Double.parseDouble(parts[2]);
                double Northing=Double.parseDouble(parts[3]);           
                double Hem;
                if (Letter>'M')
                    Hem='N';
                else
                    Hem='S';            
                double north;
                if (Hem == 'S')
                    north = Northing - 10000000;
                else
                    north = Northing;
                latitude = (north/6366197.724/0.9996+(1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)-0.006739496742*Math.sin(north/6366197.724/0.9996)*Math.cos(north/6366197.724/0.9996)*(Math.atan(Math.cos(Math.atan(( Math.exp((Easting - 500000) / (0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting - 500000) / (0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2)/3))-Math.exp(-(Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*( 1 -  0.006739496742*Math.pow((Easting - 500000) / (0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2)/3)))/2/Math.cos((north-0.9996*6399593.625*(north/6366197.724/0.9996-0.006739496742*3/4*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.pow(0.006739496742*3/4,2)*5/3*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996 )/2)+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4-Math.pow(0.006739496742*3/4,3)*35/27*(5*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/3))/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2))+north/6366197.724/0.9996)))*Math.tan((north-0.9996*6399593.625*(north/6366197.724/0.9996 - 0.006739496742*3/4*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.pow(0.006739496742*3/4,2)*5/3*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2*north/6366197.724/0.9996 )*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4-Math.pow(0.006739496742*3/4,3)*35/27*(5*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/3))/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2))+north/6366197.724/0.9996))-north/6366197.724/0.9996)*3/2)*(Math.atan(Math.cos(Math.atan((Math.exp((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2)/3))-Math.exp(-(Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2)/3)))/2/Math.cos((north-0.9996*6399593.625*(north/6366197.724/0.9996-0.006739496742*3/4*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.pow(0.006739496742*3/4,2)*5/3*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4-Math.pow(0.006739496742*3/4,3)*35/27*(5*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/3))/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2))+north/6366197.724/0.9996)))*Math.tan((north-0.9996*6399593.625*(north/6366197.724/0.9996-0.006739496742*3/4*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.pow(0.006739496742*3/4,2)*5/3*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4-Math.pow(0.006739496742*3/4,3)*35/27*(5*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/3))/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2))+north/6366197.724/0.9996))-north/6366197.724/0.9996))*180/Math.PI;
                latitude=Math.round(latitude*10000000);
                latitude=latitude/10000000;
                longitude =Math.atan((Math.exp((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2)/3))-Math.exp(-(Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2)/3)))/2/Math.cos((north-0.9996*6399593.625*( north/6366197.724/0.9996-0.006739496742*3/4*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.pow(0.006739496742*3/4,2)*5/3*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2* north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4-Math.pow(0.006739496742*3/4,3)*35/27*(5*(3*(north/6366197.724/0.9996+Math.sin(2*north/6366197.724/0.9996)/2)+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/4+Math.sin(2*north/6366197.724/0.9996)*Math.pow(Math.cos(north/6366197.724/0.9996),2)*Math.pow(Math.cos(north/6366197.724/0.9996),2))/3)) / (0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2))))*(1-0.006739496742*Math.pow((Easting-500000)/(0.9996*6399593.625/Math.sqrt((1+0.006739496742*Math.pow(Math.cos(north/6366197.724/0.9996),2)))),2)/2*Math.pow(Math.cos(north/6366197.724/0.9996),2))+north/6366197.724/0.9996))*180/Math.PI+Zone*6-183;
                longitude=Math.round(longitude*10000000);
                longitude=longitude/10000000;       
            }   
        }
    }

    public Double[] ENtoLL(Double loc1, Double loc2) {
        return null;
    }

    public Double[] LLtoEN(Double loc1, Double loc2) {
        return null;
    }
    public class JHtml {

        public String html (String head, String body, String footer, String attr) {
            String res = "<!DOCTYPE html> <html " + attr +">" 
                            + head + body + footer + 
                            "</html>";
            return res;
        }
    
        public String head(String value) {
            return "<head>" + value + "</head>";
        }
        
        public String header (String header, String attr) {
            if (attr != null) {
                return "<header "+ attr + ">" + header + "</header>";
            } else {
                return "<header>" + header + "</header>";                
            }
        }
        
        public String body (String body, String... attr) {
            if (attr != null) {
                return "<body " + new JContent().new Spread().STRING(Arrays.asList(), attr) + ">" + body + "</body>";
            }
            else {
                return "<body> " + body + "</body>";
            }
        }
    
        public String footer (String footer, String... attr) {
            return "<footer "+ new JContent().new Spread().STRING(Arrays.asList(), attr) + " >" + footer + "</footer>";
        }
    
        public String style (String style) {
            // return "<style> body: {color: #ddd} footer: {color: #08075C; text-align: center} header: {color: #08075C} </style>";
            return "<style> " + style + "</style>";
        }
    
        public String disclaimer() {
            return "";
        }
    
        public String center (String value) {
            return "";
        }

        public String div (String value, String... attr){
            return "<div "+ new JContent().new Spread().STRING(Arrays.asList(), attr) + " >" + value + "</div>";
        }
    
        public String table(List<String> tr) {
            String thead = "";
            String tbody = "";
            thead += "<tr>" + tr.get(0) + "</tr>";
            for (int i = 1; i < tr.size(); i++) {
                tbody += "<tr>" + tr.get(i) + "</tr>";
            }
            return "<table> " + thead + tbody + "</table>";
        }

        public String bold (String text) {
            return "<b>" + text + "</b>";
        }
    }

    public String JCss () {
        String l1 = ".jpc .form-block span.notAvailable:before{ color:red; content: 'Not Available'; font-size: 12px; } .jpc .form-block span.on:after { color: red; content: '*'; } .jpc .form-block .pwNotMatch:before { color: red; content: 'Password not match'; font-size: 12px; } .jpc .form-block span.userExist:before { color: red; content: 'User Exist'; font-size: 12px; } .jpc .half { width:calc(49% - 1px); } .jpc .inputfile-container { display: flex; align-items: center; } .jpc .inputfile { width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; position: absolute; z-index: -1; } .jpc .inputfile + label { color: black; background-color: whitesmoke; display: inline-block; cursor: pointer; padding: 10px 12px; border-radius: 4px; border: 0.5px dotted black; }.jpc .inputfile:focus + label,.jpc .inputfile + label:hover { outline: -webkit-focus-ring-color auto 5px; box-shadow: 0px 1px 2px rgba(0,0,0,0.4); border-radius: 4px;}";
        String l2 = ".jpc .progress-status { color: yellow; } .jpc .progress-bar { visibility: hidden; margin: 5px; overflow: hidden; } .jpc .w-100 { width: 100%; } .jpc .w-75 { width: 75%; } .jpc .w-50 { width: 50%; } .jpc .w-25 { width: 25%; } @media(max-width: 768px){ .jpc .w-100, .jpc .w-75, .jpc .w-50, .jpc .w-25 { width: 100%; } } .jpc .xsmall { font-size: 10px; } .jpc .small { font-size: small; } .jpc .ml-1 { margin-left: 1px; } .jpc .opt-btn { margin-right: .8em; float: right; display: flex; } .jpc .main-btn { margin: 3px; margin-bottom: 10px; text-align: left; } .jpc .btn-height { height: 38px; position: relative; padding: 6px; margin-top: 10px; } .jpc .strong-md { font-weight: bold; font-size: medium; margin-bottom: 20px; display: block; } .jpc .strong-md::before { content: '*'; } /* .jpc ::-webkit-scrollbar { width: 20px; } .jpc ::-webkit-scrollbar-button { border-radius: 10px; background-color: blue; color: blue; }";
        String l3 = ".jpc ::-webkit-scrollbar-thumb { background: red; } .jpc ::-webkit-scrollbar-thumb:hover { background: #b30000; } */ .jpc .card-icon { max-width: 50px; background-color: inherit; border: 1px solid gray; color: green; margin: 5px; padding: 5px; vertical-align: top; } .jpc .card-icon:hover { cursor: pointer; color: yellowgreen; } .jpc .border { border: 1px solid black; } .jpc .border-top { border-top: 1px solid black; } .jpc .border-bottom { border-bottom: 1px solid whitesmoke; } .jpc .border-left { border-left: 1px solid black; } .jpc .border-right { border-right: 1px solid black; } .jpc .cover-bg { background-color: transparent; min-width: 100%; min-height: 100%; position: absolute; right: 0; left: 0; bottom: 0; display: flex; z-index: 3; flex-direction: column; align-items: center; justify-content: center; padding: 5px; transition: all .8s; overflow: hidden; } .jpc .show { opacity: 1 !important; }";
        String l4 = ".jpc .hide { opacity: 0 !important; pointer-events: none; height: 0px; } .jpc .slide-down { transform: translateY(100px); height: 0; } .jpc .slide-up { transform: translateY(0); height: 100%; } .jpc .slide-left { transform: translateX(0); } .jpc .slide-right { transform: translateX(100px); } .jpc .simple-anim { transition: all .8s; overflow: hidden; } .jpc .inline { display: inline !important; } .jpc .inline-block { display: inline-block !important; } .jpc .no-top-margin { margin-top: 0.1px !important; } .jpc .no-bottom-margin { margin-bottom: 0.1px !important; } .jpc .no-left-margin { margin-left: 0.1px !important; } .jpc .no-right-margin { margin-right: 0.1px !important; }";
        String l5 = ".jpc .zero-left-margin { margin-left: 0px !important; } .jpc .zero-right-margin { margin-right: 0px !important; } .jpc .zero-top-margin { margin-top: 0px !important; } .jpc .zero-bottom-margin { margin-bottom: 0px !important; } .jpc .rm-20 { margin-right: 20px !important; } .jpc .bm-20 { margin-bottom: 20px !important; } .jpc .margin-5 { margin: 5px !important; } .jpc .margin-10 { margin: 10px !important; } .jpc .margin-10-top-bottom { margin: 10px 0px; } .jpc .margin-20-top-bottom { margin: 20px 0px; } .jpc .no-border { border: none !important; } .jpc .capital-letter { text-transform: uppercase !important; } .jpc .green-border { border-color: green !important; } .jpc .h-100 { height: 100% !important; } .jpc .btn-like { cursor: pointer; color: #66e; } .jpc .right-btn-like { margin-right: 10px; cursor: pointer; } .jpc .left-btn-like { margin-left: 10px; cursor: pointer; color: blueviolet; font-size: 15px; }";
        String l6 = ".jpc .btn-optional { margin-left: 10px; } .jpc .label-field-format > div { flex: 3; position: relative; margin: 0px; border-radius: 4px; border-top-left-radius: 0px; border-bottom-left-radius: 0px; width: 100%; height: 44px; } .jpc .minor-transition { transition: cubic-bezier(0.6, -0.28, 0.735, 0.045) 1s; } .jpc .minor-transition > div, .jpc .minor-transition > form { transition: cubic-bezier(0.6, -0.28, 0.735, 0.045) 1s; } .jpc-flex { display: flex; } .jpc-btn-optional { margin-left: 20px; } .jpc-error { color: red !important; } .jpc-bg-error { background-color: red !important; color: white; } .jpc-waiting { color: gold !important; } .jpc-bg-waiting { background-color: gold !important; color: white; } .jpc-success { color: green !important; } .jpc-bg-success { background-color: green !important; color: white; } .jpc-inline { display: inline; } .jpc-inline-block { display: inline-block; } .jpc-block { display: block; } .jpc-float-bottom-right { right: 0; bottom: 0; position: fixed; }";
        String l7 = ".jpc .right{ float: right !important; } .jpc .left { float: left !important; } .jpc .content-right { text-align: right !important; } .jpc .content-left { text-align: left !important; } .jpc .content-center { text-align: center !important; } .jpc .content-justify { text-align: justify !important; } .jpc .content-center-middle { min-height: 50vh; display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center; padding: 5px; } .jpc .content-left-middle{ vertical-align: middle !important; text-align: left !important; } .jpc .content-middle { vertical-align: middle !important; } .jpc .content-bottom { vertical-align: bottom !important; } .jpc .content-top { vertical-align: top !important; }";
        return l1 + l2 + l3 + l4 + l5 + l6 + l7;
    }

    public static class generatePDF {
        // private static Object XMLWorkerHelper;

        public static Optional<String> fromHTML(String html, String output) {
            try {
                String fileName = output+".pdf";
                html = "<html><body><div> TEST </div></body></html>";
                FileOutputStream file = new FileOutputStream(new File(fileName));
                Document document = new Document();
                PdfWriter writer = PdfWriter.getInstance(document, file);
                document.open();
                ByteArrayInputStream is = new ByteArrayInputStream(html.getBytes());
                com.itextpdf.tool.xml.XMLWorkerHelper.getInstance().parseXHtml(writer, document, is);
                document.close();
                file.close();
                System.out.println("Pdf Created");
                return Optional.of(fileName);
            } catch (Exception e) {
                e.printStackTrace();
                return Optional.empty();
            }
        }
    }
}