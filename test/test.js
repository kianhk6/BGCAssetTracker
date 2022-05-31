import chai from "chai";
import chaiHTTP from 'chai-http';
import app from '../api/index';

// var chai = import ('chai');
// var chaiHTTP = import ('chai-http');
//var server = import('../api/index');

var should = chai.should();
chai.use(chaiHttp);

//-------------------------------------------------------------------------------------------------//
//  THERE ARE 2 MAIN TYPES OF TESTS BEING PERFORMED.                                               //
//  1) TESTS RELATING TO USERS                                                                     //
//  2) TESTS RELATING TO EQUIPMENT                                                                 //
//                                                                                                 //
//  THE STORIES THAT EACH OF THE TESTS ARE RELATED TO ARE LISTED BY EACH TEST AS WELL              //
//-------------------------------------------------------------------------------------------------//


//ALL TESTS FOR USERS
//Relates to stories: 1,2,3,4,5,6,7,8,16,19,20

describe('users',function(){

    //tests associated with stories related to ADDING users

    //STORIES: 5,6 
    it('should add a single user on POST request for /Signup', function(done){

        chai.request(server).post('/api/Signup').send({'user_name':'testname' , 'user_status':'a'})
            .end(function(error,res){
                res.should.have.status(200);
                res.should.be,json;
                done();
        });
    });


    //test for logging in

    //STORIES: 1,2,3,4
    it('should let the user on POST Request for /login', function(done){

        chai.request(server).post('/api/login').send({'email':'testemail' , 'password':'a'})
            .end(function(error,res){
                res.should.have.status(200);
                done();
        });
    });

    //test for logging out

    //STORIES: 7,8
    it('should let the user on POST request for /logout', function(done){

        chai.request(server).post('/api/logout')
            .end(function(error,res){
                res.should.have.status(200);
                done();
        });
    });

    //test for refreshing token

    //STORIES: 7, 16
    it('should refresh the token for the user on POST request for /refresh', function(done){

        chai.request(server).post('/api/refresh')
            .end(function(error,res){
                res.should.have.status(200);
                done();
        });
    });

    //test for updating user details

    //STORIES: 19,20
    it('should update the details for the user on POST request for /updateUser', function(done){

        chai.request(server).post('/api/updateUser')
            .end(function(error,res){
                res.should.have.status(200);
                done();
        });
    });

});

//In Here are the tests associated with EQUIPMENT
//Relates to Stories: 9,10,11,23,24,25,26,27,28,32,33

describe('equipments',function(){

    //tests associated with adding equipment

    //STORIES: 9,10
    it('should add a single equipment on POST request for /addEquipment', function(done){

        //This is the post request for adding equipment
        chai.request(server).post('/api/addEquipment').send({'barcode_id': '1', 'serial_number': '1' , 'equipment_type': 'type_1' , 'category': 'cat_1', 'project': 'proj1', 'equipment_status':'ch', 'equipment_group':'1', 'borrower':'baban', 'location': 'van'})
            .end(function(error,res){
                res.should.have.status(200);
                res.should.be,json;
                done();
        });
    });


    //test for deleting equipment

    //STORIES: 11,23
    it('should delete a single equipment on POST request for /deleteEquipment', function(done){

            chai.request(server).post('/api/deleteEquipment')
            .end(function(error,res){
                res.should.have.status(200);
                done();
        });

    });


    //test for updating equipment

    //STORIES: 21
    it('should request a update equipment on POST request for /updateEquip', function(done){

        chai.request(server).post('/api/updateEquip').send({'equipment_type': '1', 'category': '1' , 'project': 'a' , 'equipment_status': '1', 'equipment_group': '1', 'equipment_location':'van', 'barcode_id': '3'})
        .end(function(error,res){
            res.should.have.status(200);
            done();
        });
    });


    //test for request equipment equipment

    //STORIES: 25,26,27
    it('should request a update equipment on POST request for /RequestedEquipmentQuery', function(done){

        chai.request(server).post('/api/RequestedEquipmentQuery')
        .end(function(error,res){
            res.should.have.status(200);
            done();
        });
    });
    
    
    //test for checking in equipment

    //STORIES: 33
    it('should check in a single equipment on POST request for /checkIn', function(done){

        chai.request(server).post('/api/checkIn')
        .end(function(error,res){
            res.should.have.status(200);
            done();
         });
    });

    //test for Reqesting equipment

    //STORIES: 25
    it('should Request single equipment on POST request for /RequestEquip', function(done){

        chai.request(server).post('/api/RequestEquip')
        .end(function(error,res){
            res.should.have.status(200);
            done();
         });
    });

    //test for Accepting Reqested equipment

    //STORIES: 28
    it('should Request single equipment on POST request for /AcceptRequestEquip', function(done){

        chai.request(server).post('/api/AcceptRequestEquip')
        .end(function(error,res){
            res.should.have.status(200);
            done();
         });
    });


    //test for Denied Reqested equipment (from user side)

    //STORIES: 25
    it('should Request single equipment on POST request for /CancelRequestEquip', function(done){

        chai.request(server).post('/api/CancelRequestEquip')
        .end(function(error,res){
            res.should.have.status(200);
            done();
         });
    });

    //test for Denied Reqested equipment (from EquipManager/Admin side)

    //STORIES: 27
    it('should Request single equipment on POST request for /CancelRequestEquipPro', function(done){

        chai.request(server).post('/api/CancelRequestEquipPro')
        .end(function(error,res){
            res.should.have.status(200);
            done();
         });
    });

    //test for checking if equipment is overdue (end date has passed)

    //STORIES: 32
    it('should Request single equipment on POST request for /checkForOverdueEquipment', function(done){

        chai.request(server).post('/api/checkForOverdueEquipment')
        .end(function(error,res){
            res.should.have.status(200);
            done();
         });
    });
});